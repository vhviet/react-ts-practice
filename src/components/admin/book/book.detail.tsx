import {FORMAT_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Divider, Drawer, Image, Upload, UploadFile, UploadProps } from "antd";
import { GetProp } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';


interface IProps {
    openBookDetail: boolean;
    setOpenBookDetail: (v: boolean) => void;
    viewBookDetail: IBookTable | null;
    setViewBookDetail: (v: IBookTable | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const BookDetail = (props: IProps) => {
    const { openBookDetail, setOpenBookDetail, viewBookDetail, setViewBookDetail } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    // const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])

    useEffect(() => {
        if (viewBookDetail) {
            let thumbnailImg: any = {};
            const sliderImg: UploadFile[] = [];
            if (viewBookDetail.thumbnail) {
                    thumbnailImg = {
                        uid: uuidv4(),
                        name: viewBookDetail.thumbnail,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${viewBookDetail.thumbnail}`
                }
            }
            if (viewBookDetail.slider?.length > 0) {
                viewBookDetail.slider.map(item => {
                    sliderImg.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}` 
                        })
                    })
            }

            setFileList([thumbnailImg,...sliderImg])
        }
    },[viewBookDetail])

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    
    const handleClose = () => {
        setOpenBookDetail(false);
        setViewBookDetail(null);
    }

    // const handleCancel = () => {
    //     setOpenBookDetail(false)
    // }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Drawer
                title="Book Details"
                width={"50vw"}
                open={openBookDetail}
                onClose={() => handleClose()}
            >
                <Descriptions title={`Book ${viewBookDetail?._id}`} column={1} bordered>
                    <Descriptions.Item label="Id">
                        {viewBookDetail?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Book name">
                        {viewBookDetail?.mainText}
                    </Descriptions.Item>
                    <Descriptions.Item label="Author">
                        {viewBookDetail?.author}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                        {viewBookDetail?.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">
                        <Badge status="processing" text={viewBookDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created at">
                        {viewBookDetail?.createdAt
                            ? dayjs(viewBookDetail.createdAt).format(FORMAT_DATE_VN)
                            : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated at">
                        {viewBookDetail?.updatedAt
                            && dayjs(viewBookDetail.updatedAt).format(FORMAT_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" style={{ fontSize: "14px", fontWeight: "normal" }}>Book Images</Divider>
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                >
                </Upload>

                {previewImage && (
                    <Image
                        style={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: setPreviewOpen,
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default BookDetail