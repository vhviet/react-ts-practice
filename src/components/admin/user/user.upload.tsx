import { InboxOutlined } from "@ant-design/icons";
import { Divider, message, Modal, Table, Upload } from "antd";
import { UploadProps } from "antd/lib";

interface IProps {
    isUploadOpen: boolean;
    setIsUploadOpen: (v: boolean) => void;
}

interface IDataUpload{
    fullName: string;
    email: string;
    fullName: string;
}

const UploadUser = (props: IProps) => {
    const { isUploadOpen, setIsUploadOpen } = props;
    console.log(isUploadOpen, setIsUploadOpen);
    const { Dragger } = Upload;

    const propsUpload: UploadProps = {
      name: "file",
      multiple: false,
      maxCount: 1,
        accept: ".csv,.xls,.xlsx",
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
              message.success(`${info.file.name} file uploaded successfully.`);
              if (info.fileList && info.fileList.length > 0) {
                  const file = info.fileList[0].originFileObj;
              }
          } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
        onDrop(e) {
          console.log("Dropped files", e.dataTransfer.files);
        },
    };


    return (
      <Modal
        title="Import users"
        open={isUploadOpen}
        onCancel={() => setIsUploadOpen(false)}
        onOk={() => setIsUploadOpen(false)}
        okText={"Upload"}
        okButtonProps={{
          type: "primary",
          disabled: true,
        }}
      >
        <Divider />
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>

        <Table
          title={() => <span>Preview data</span>}
          columns={[
            { title: "Tên", dataIndex: "fullName", key: "fullName" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
          ]}
          dataSource={[]}
        />
      </Modal>
    );
};

export default UploadUser