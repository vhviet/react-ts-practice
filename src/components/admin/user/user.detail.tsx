import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE } from 'services/helper';

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (v: IUserTable | null) => void;
}
const UserDetail = (props: IProps) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
  const handleClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  }

  return (
    <div>
      <Drawer
        title="User Details"
        width={"50vw"}
        open={openViewDetail}
        onClose={() => handleClose()}
      >
        <Descriptions title={`User ${dataViewDetail?._id}`} column={1} bordered>
          <Descriptions.Item label="Full name">
            {dataViewDetail?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {dataViewDetail?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Badge status="processing" text={dataViewDetail?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {dataViewDetail?.createdAt
              ? dayjs(dataViewDetail.createdAt).format(FORMAT_DATE)
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {dataViewDetail?.updatedAt
              ? dayjs(dataViewDetail.updatedAt).format(FORMAT_DATE)
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Avatar">
            <Avatar
              size={50}
              src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                dataViewDetail?.avatar
              }`}
            />
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
}

export default UserDetail