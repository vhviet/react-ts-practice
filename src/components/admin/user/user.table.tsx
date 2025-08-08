import deleteUserAPI, { getUsersAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import UserDetail from "./user.detail";
import CreateUser from "./user.add";
import ImportUser from "./user.import";
import UpdateUser from "./user.update";
import { CSVLink } from "react-csv";
import { PopconfirmProps } from "antd/lib";
import { SortOrder } from "antd/es/table/interface";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploadOpen,   setIsUploadOpen] = useState<boolean>(false);
  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
  const { notification, message } = App.useApp();

  const actionRef = useRef<ActionType>();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const handleConfirm = async (_id: string) => {
    const res = await deleteUserAPI(_id);
    if (res?.data) {
      refreshTable();
      notification.success({
        message: "Delete user",
        description: `Deleted successfully! user ${_id}`
      })
    } else {
      notification.error({
        message: "Detele user",
        description: JSON.stringify(res.message)
      })
    }
  };

  const handleCancel: PopconfirmProps["onCancel"] = () => {
    message.success("Cancelled delete user!", 1);
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      title: "No.",
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
            onClick={() => {
              setDataViewDetail(entity);
              setOpenViewDetail(true);
            }}
          >
            {entity._id}
          </a>
        );
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
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(entity);
              }}
            />

            <Popconfirm
              title="Delete user"
              description="Are you sure to delete this user?"
              onConfirm={() => handleConfirm(entity._id)}
              onCancel={handleCancel}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
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
  };

  return (
    <>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          await waitTime(200);
          console.log(params, sort, filter);
          const buildQuery = (
            params: TSearch & {
              pageSize?: number;
              current?: number;
              keyword?: string;
            },
            sort: Record<string, SortOrder>
          ): string => {
            const queryParts: string[] = [];

            // Pagination
            if (params.current) queryParts.push(`current=${params.current}`);
            if (params.pageSize) queryParts.push(`pageSize=${params.pageSize}`);

            // Keyword search (optional)
            // if (params.keyword) {
            //   queryParts.push(`keyword=/${params.keyword}/i`);
            // }

            // Specific filters
            if (params.email) queryParts.push(`email=/${params.email}/i`);
            if (params.fullName)
              queryParts.push(`fullName=/${params.fullName}/i`);

            // Date range
            const dateRange = dateRangeValidate(params.createdAtRange);
            if (params.createdAtRange && dateRange) {
              queryParts.push(`createdAt>=${dateRange[0]}`);
              queryParts.push(`createdAt<=${dateRange[1]}`);
            }

            // Sorting
            const sortKey =
              sort?.createdAt === "ascend" ? "createdAt" : "-createdAt";
            queryParts.push(`sort=${sortKey}`);

            return queryParts.join("&");
          };

          const query = buildQuery(params, sort);
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
