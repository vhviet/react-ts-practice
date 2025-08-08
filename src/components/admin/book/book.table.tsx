import { getBooksAPI } from "@/services/api";
import {
  CloudDownloadOutlined,
  // CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { PopconfirmProps } from "antd/lib";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";

type TSearchBook = {
  mainText: string;
  author: string;
};

const BoookTable = () => {
  const actionRef = useRef<ActionType>();
  const { notification, message } = App.useApp();
  const [viewBookDetail, setViewBookDetail] = useState<IBookTable | null>(null);
  const [openBookDetail, setOpenBookDetail] = useState<boolean>(false);
  const [openAddBook, setOpenAddBook] = useState<boolean>(false);
  const [currentDataBookTb, setCurrentDataBookTb] = useState<IBookTable[]>([]);
  const [openBookUpdate, setOpenBookUpdate] = useState<boolean>(false);
  const [dataBookUpdate, setDataBookUpdate] = useState<IBookTable | null>(null);

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const columns: ProColumns<IBookTable>[] = [
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
              setViewBookDetail(entity);
              setOpenBookDetail(true);
            }}
          >
            {entity._id}
          </a>
        );
      },
    },
    {
      title: "Book name",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      hideInSearch: true,
    },
    {
      title: "Author",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: true,
      hideInSearch: true,
      render: (_, entity) =>
        entity.price?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) ?? "—",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
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
                setOpenBookUpdate(true);
                setDataBookUpdate(entity);
              }}
            />

            <Popconfirm
              title="Delete book"
              description="Are you sure to delete this book?"
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

  const handleConfirm = async (_id: string) => {
    // const res = await deleteUserAPI(_id);
    // if (res?.data) {
    //   refreshTable();
    //   notification.success({
    //     message: "Delete book",
    //     description: `Deleted successfully! book ${_id}`,
    //   });
    // } else {
    //   notification.error({
    //     message: "Detele book",
    //     description: JSON.stringify(res.message),
    //   });
    // }
  };

    const handleCancel: PopconfirmProps["onCancel"] = () => {
      message.success("Cancelled delete book!", 1);
    };

  const waitTime = (time: number = 100): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  return (
    <>
      <ProTable<IUserTable, TSearchBook>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          await waitTime(200);
          console.log(params, sort, filter);
          const buildQuery = (
            params: TSearchBook & {
              price?: number;
              createdAt?: Date;
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

            // Specific filters
            if (params.mainText)
              queryParts.push(`mainText=/${params.mainText}/i`);
            if (params.author) queryParts.push(`author=/${params.author}/i`);

            // Sorting
            // const sortFields = [
            //   { key: "mainText", order: sort.mainText },
            //   { key: "author", order: sort.author },
            //   { key: "price", order: sort.price },
            //   { key: "createdAt", order: sort.createdAt },
            // ];

            // const firstSort = sortFields.find(
            //   ({ order }) => order === "ascend" || order === "descend"
            // );

            // const querySort = firstSort
            //   ? `sort=${
            //       firstSort.order === "ascend"
            //         ? firstSort.key
            //         : `-${firstSort.key}`
            //     }`
            //   : "sort=-createdAt";

            // queryParts.push(querySort);
            const sortKeys = ["createdAt", "mainText", "author", "price"];

            let querySort = "sort=-createdAt"; // default

            for (const key of sortKeys) {
              const order = sort[key];
              if (order === "ascend" || order === "descend") {
                querySort = `sort=${order === "ascend" ? key : `-${key}`}`;
                break;
              }
            }

            queryParts.push(querySort);


            return queryParts.join("&");
          };

          const query = buildQuery(params, sort);
          const res = await getBooksAPI(query); 

          if (res?.data) {
            setMeta(res.data.meta);
            setCurrentDataBookTb(
              (res?.data?.result as unknown as IBookTable[]) ?? []
            );
          }
          return {
            data: res.data?.result as unknown as IBookTable[],
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
        headerTitle="Table books"
        toolBarRender={() => [
          <Button key="button" icon={<CloudDownloadOutlined />} type="primary">
            <CSVLink data={currentDataBookTb} filename="book-table.csv">
              Export
            </CSVLink>
          </Button>,
          // <Button
          //   key="button"
          //   icon={<CloudUploadOutlined />}
          //   onClick={() => setIsUploadOpen(true)}
          //   type="primary"
          // >
          //   Import
          // </Button>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setOpenAddBook(true)}
            type="primary"
          >
            Add new
          </Button>,
        ]}
      />
    </>
  );
};

export default BoookTable;
