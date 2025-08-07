import { InboxOutlined } from "@ant-design/icons";
import { App, Divider, Modal, notification, Table, Upload } from "antd";
import { UploadProps } from "antd/lib";
import { useState } from "react";
import { Buffer } from "buffer";
import ExcelJS from "ExcelJS";
import { importUserAPI } from "@/services/api";
import userTemplate from "assets/template/Template_User.xlsx?url";

interface IProps {
  isUploadOpen: boolean;
  setIsUploadOpen: (v: boolean) => void;
  refreshTable: () => void;
}

interface IDataImport {
  fullName: string;
  email: string;
  phone: string;
}

const ImportUser = (props: IProps) => {
  const { isUploadOpen, setIsUploadOpen, refreshTable } = props;
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message } = App.useApp();

  const { Dragger } = Upload;

  const propsUpload: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: ".csv,.xls,.xlsx",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        // message.success(`${info.file.name} file uploaded successfully.`);
        const file = info.fileList?.[0]?.originFileObj;
        if (file) {
          //load file to buffer
          const workbook = new ExcelJS.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await workbook.xlsx.load(buffer);

          //load file to json
          const jsonData: IDataImport[] = [];
          workbook.worksheets.forEach(function (sheet) {
            const firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;
            const keys = firstRow.values as any[];
            sheet.eachRow((row, rowNumber) => {
              if (rowNumber == 1) return;
              const values = row.values as any;
              const obj: any = {};
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i];
              }
              jsonData.push(obj);
            });
          });
          setDataImport(jsonData);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleImportUser = async () => {
    setIsSubmit(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = dataImport.map((item, index) => ({
      ...item,
      password: import.meta.env.VITE_PASSWORD_DEFAULT,
    }));

    const res = await importUserAPI(data);
    if (res?.data) {
      setDataImport([]);
      setIsUploadOpen(false);
      if (res.data?.countSuccess !== 0) {
        refreshTable();
        notification.success({
          message: "Import users successfully!",
          description: `Imported ${res.data.countSuccess} users`,
          duration: 1,
        });
      } else {
        notification.error({
          message: "Import user failed!",
          description: `Imported ${res.data.countError} users failed! Duplicated users or emails!`,
          duration: 1,
        });
      }
    } else {
      notification.error({
        message: "Import user failed!",
        description: JSON.stringify(res.message),
        duration: 1,
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Import users"
      open={isUploadOpen}
      onCancel={() => {
        setIsUploadOpen(false);
        setDataImport([]);
      }}
      onOk={() => handleImportUser()}
      okText={"Upload"}
      okButtonProps={{
        type: "primary",
        disabled: dataImport.length > 0 ? false : true,
        loading: isSubmit,
      }}
      destroyOnClose={isUploadOpen}
    >
      <Divider />
      <Dragger {...propsUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Accept file type .csv,.xls,.xlsx</p>
        <p className="ant-upload-hint">
          Supports only single file upload.Please download&nbsp;
          <a href={userTemplate} download onClick={(e) => e.stopPropagation()}>
            template file
          </a>{" "}here.
        </p>
      </Dragger>

      <Table
        title={() => <span>Preview data</span>}
        columns={[
          { title: "Username", dataIndex: "fullName", key: "fullName" },
          { title: "Email", dataIndex: "email", key: "email" },
          { title: "Phone number", dataIndex: "phone", key: "phone" },
        ]}
        dataSource={dataImport}
      />
    </Modal>
  );
};

export default ImportUser;
