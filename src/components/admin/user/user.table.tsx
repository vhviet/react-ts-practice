import { getUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useRef, useState } from "react";
import UserDetail from "./user.detail";
import CreateUser from "./user.add";
import ImportUser from "./user.import";
import UpdateUser from "./user.update";
import { CSVLink } from "react-csv";

type TSearch = {
  fullName: string,
  email: string,
  createdAt: string,
  createdAtRange: string,
}

const TableUser = () => {
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);


  const actionRef = useRef<ActionType>();
  
  const [meta, setMeta] = useState({
      current: 1,
      pageSize: 10,
      pages: 0,
      total: 0,
  })

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      hideInSearch: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return (
          <a
            href="#"
            onClick={
              () => {
                setDataViewDetail(entity);
                setOpenViewDetail(true);
              }
            }
          >
            {entity._id}
          </a>);
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Action",
      key: "action",
      hideInSearch: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(dom, entity, index, action, schema) {
        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <EditOutlined style={{ cursor: "pointer", color: "orange" }} onClick={()=>setOpenModalUpdate(true)}/>
            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
          </div>
        );
      },
    },
  ];

  const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
  };

  const refreshTable = () => {
    actionRef.current?.reload();
  }

  const handleExportUsers = () => {};

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          await waitTime(200);
          console.log(params, sort, filter);
          let query = "";
          if (params) {
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              query += `&email=/${params.email}/i`;
            }

            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }

            const createDateRange = dateRangeValidate(params.createdAtRange);
            if (params.createdAtRange && createDateRange)
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
          }

          if (sort && sort.createdAt) {
            query += `&sort=${
              sort.createdAt === "ascend" ? "createdAt" : "-createdAt"
            }`;
          } else query += "&sort=-createdAt";

          const res = await getUsersAPI(query);

          if (res?.data) {
            setMeta(res.data.meta);
            setCurrentDataTable(
              (res?.data?.result as unknown as IUserTable[]) ?? []
            );
          }
          return {
            data: res.data?.result as unknown as IUserTable[],
            page: res.data?.meta.current,
            success: true,
            total: res.data?.meta.total,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]}-{range[1]}/total {total}
              </div>
            );
          },
          style: {
            display: "flex",
            justifyContent: "center",
          },
        }}
        headerTitle="Table users"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<CloudDownloadOutlined />}
            onClick={() => handleExportUsers()}
            type="primary"
          >
            <CSVLink data={currentDataTable} filename="users-table.csv">
              Export
            </CSVLink>
          </Button>,
          <Button
            key="button"
            icon={<CloudUploadOutlined />}
            onClick={() => setIsUploadOpen(true)}
            type="primary"
          >
            Import
          </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
      <UserDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
      <CreateUser
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        refreshTable={refreshTable}
      />

      <ImportUser
        isUploadOpen={isUploadOpen}
        setIsUploadOpen={setIsUploadOpen}
        refreshTable={refreshTable}
      />

      <UpdateUser
        refreshTable={refreshTable}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  );
};

export default TableUser;