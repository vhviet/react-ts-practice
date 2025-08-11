import { getCategoryAPI } from "@/services/api";
import { FILE_SIZE_MAX } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Form, GetProp, Input, InputNumber, Modal, Row, Select, UploadFile } from "antd"
import { useForm } from "antd/es/form/Form";
import { UploadChangeParam } from "antd/es/upload";
import { FormProps, Upload, UploadProps } from "antd/lib";
import { useEffect, useState } from "react";
interface IProps {
    openAddBook: boolean;
    setOpenAddBook: (v: boolean) => void;
}
type FieldType = {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const BookAdd = (props: IProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const { openAddBook, setOpenAddBook } = props;
    const { notification, message } = App.useApp();
    const [formAddBook] = useForm();

    useEffect(() => {
        const fetchListCategory = async () => {
            const res = await getCategoryAPI();
            if (res?.data) {
                const category = res.data.map(item => {
                    return { label: item, value: item };
                })
                setListCategory(category);
            }
        }
        fetchListCategory();
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        setIsSubmit(false);
        console.log(values);
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < FILE_SIZE_MAX;
        if (!isLt2M) {
            message.error(`Image must smaller than ${FILE_SIZE_MAX}MB!`);
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            return type === 'slider'
                ? setLoadingSlider(true)
                : setLoadingThumbnail(true);
        }


        if (info.file.status === 'done') {
            // Get this url from response in real world.
            return type === "slider"
                ? setLoadingSlider(false)
                : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            if (onSuccess)
                onSuccess("ok");
        }, 1000);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };




    return (
        <>
            <Modal
                title="Add new user"
                open={openAddBook}
                onOk={() => formAddBook.submit()}
                onCancel={() => {
                    setOpenAddBook(false);
                    formAddBook.resetFields();
                }}
                okText={"Add"}
                okButtonProps={{ loading: isSubmit }}
                destroyOnClose={true}
                confirmLoading={isSubmit}
                width={"50vw"}
                maskClosable={false}
            >
                <Divider />
                <Form
                    form={formAddBook}
                    name="form-add"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Book name"
                                name="mainText"
                                rules={[{ required: true, message: 'Book name cannot be empty!' }]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Author"
                                name="author"
                                rules={[{ required: true, message: 'Author name cannot be empty!' }]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: 'Price cannot be empty!' }]}>
                                <InputNumber
                                    min={1}
                                    formatter= {(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter={"đ"}
                                    style={{width: "100%"}}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Category"
                                name="price"
                                rules={[{ required: true, message: 'Category cannot be empty!' }]}>
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true, message: 'Quantity cannot be empty!' }]}>
                                <InputNumber min={1} style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Thumbnail"
                                name="thumbnail"
                                rules={[{ required: true, message: 'Please upload thumbnail image!' }]}
                                // convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                />
                                <div>
                                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{marginTop: "8px"}}>Upload</div>
                                </div>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Sliders"
                                name="slider"
                                rules={[{ required: true, message: 'Please upload slider images!' }]}
                                // convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                />
                                <div>
                                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{marginTop: "8px"}}>Upload</div>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </>
    )
}

export default BookAdd