"use client";

import styles from "./EditPage.module.scss";

import { jost, mont } from "@/font";

import { useEffect, useRef, useState } from "react";

import InputBlock from "@/components/InputBlock/InputBlock";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";

import toast from "react-hot-toast";

import { CircleX, Plus, X } from "lucide-react";

import withAuth from "@/utils/withAuth";
import {
  handleFileChange,
  handleEditFormChange,
} from "@/utils/productCreateEdit_helpers";

import isNumeric from "validator/lib/isNumeric";

import { privateAxios } from "@/http/axios";

import useProduct from "@/hooks/useProduct";

import {
  formatImageFromServer,
  formatImageName,
} from "@/utils/formatImageName";

import { useRouter } from "next/navigation";
import { MAX_IMAGES, TOAST_DURATION } from "@/utils/constants";
import { deleteProductImage } from "@/http/productController";

interface EditProps {
  productId: string;
}

function EditPage({ productId }: EditProps) {
  const { data, isLoading } = useProduct({ id: productId });

  const [loading, setLoading] = useState(false);
  const [editIsLoading, setEditIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    detailDescription: "",
    price: "",
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [oldImageSrc, setOldImageSrc] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setEditIsLoading(true);
    if (data) {
      setForm({
        name: data.name,
        description: data.description,
        detailDescription: data.detailDescription,
        price: data.price,
      });
      setOldImageSrc(data.imageUrls || []);
    }
    setEditIsLoading(false);
  }, [data]);

  const handleImageClick = () => {
    if (uploadedImages.length + oldImageSrc.length >= MAX_IMAGES) {
      toast.error(`Максимальна кількість фотографій ${MAX_IMAGES}`);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleImageDelete = async (imageIndex: number) => {
    if (productId) {
      const result = await deleteProductImage(productId, imageIndex);

      if (result && result.status === 200) {
        setOldImageSrc((prev) => {
          const updatedImages = [...prev];
          updatedImages.splice(imageIndex, 1);
          return updatedImages;
        });
      } else {
        toast.error("Щось пішло не так. Спробуйте пізніше.");
      }
    }
  };

  const validateForm = (): boolean => {
    if (Object.values(form).some((field) => field === "")) {
      toast.error("Заповніть всі поля будь-ласка!");
      return false;
    }
    if (!isNumeric(form.price) || parseFloat(form.price) <= 0) {
      toast.error("Некоректне значення ціни!");
      return false;
    }
    return true;
  };

  const handleEditProduct = async () => {
    if (!validateForm() || !data) return;

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value.trim())
      );
      formData.append("ownerId", data.ownerId);
      formData.append("gameId", data.gameId);
      formData.append("productType", data.type);

      uploadedImages.forEach((file) =>
        formData.append("images", file, file.name)
      );

      const result = await privateAxios.put(`/products/${productId}`, formData);

      if (result.data !== null && result.status === 200) {
        toast.success("Продукт успішно змінено!");
        setTimeout(() => router.push("/profile/products"), TOAST_DURATION);
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error) {
      toast.error("Щось пішло не так! Спробуйте пізніше");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Редагувати оголошення</h1>
        {!editIsLoading && (
          <div className={styles.inputs_block}>
            <InputBlock
              name="name"
              value={form.name}
              placeholder="Наприклад: AFK Arena"
              label="Вкажіть назву"
              setValue={(e) => handleEditFormChange(e, setForm)}
            />
            <InputBlock
              name="description"
              value={form.description}
              placeholder="Наприклад: Продається унікальний аккаунт"
              label="Опис"
              setValue={(e) => handleEditFormChange(e, setForm)}
              isTextArea
            />
            <InputBlock
              name="detailDescription"
              value={form.detailDescription}
              placeholder="Детальний опис товару"
              label="Детальний опис"
              setValue={(e) => handleEditFormChange(e, setForm)}
              isTextArea
              isFull
            />
            <div className={`${styles.image_block} ${jost.className}`}>
              <p>Зображення</p>
              <div>
                {oldImageSrc &&
                  oldImageSrc.length > 0 &&
                  oldImageSrc.map((image, index) => {
                    return (
                      <div
                        key={image}
                        className={styles.image_div}
                        style={{
                          backgroundImage: `url(${
                            process.env.NEXT_PUBLIC_BACKEND_API_URL
                          }${formatImageFromServer(image)})`,
                        }}
                      >
                        <CircleX
                          color="#fff"
                          size={16}
                          fill="red"
                          className={styles.image_delete}
                          onClick={() => handleImageDelete(index)}
                        />
                      </div>
                    );
                  })}
                {uploadedImages.length + oldImageSrc.length < MAX_IMAGES && (
                  <div className={styles.plus}>
                    <Plus color="#fff" size={22} onClick={handleImageClick} />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleFileChange(e, setUploadedImages)}
                    />
                  </div>
                )}

                {uploadedImages &&
                  uploadedImages.length > 0 &&
                  uploadedImages.map((image) => {
                    return (
                      <p key={image.name}>
                        {formatImageName(image.name)}{" "}
                        <X
                          color="red"
                          size={16}
                          className={styles.delete}
                          onClick={() => {
                            setUploadedImages((prev) =>
                              prev.filter((img) => img !== image)
                            );
                          }}
                        />
                      </p>
                    );
                  })}
              </div>
            </div>
            <InputBlock
              name="price"
              value={form.price}
              placeholder="Наприклад: 50$"
              label="Ціна"
              setValue={(e) => handleEditFormChange(e, setForm)}
            />
            <ServiceButton
              isActive
              className={styles.btn}
              onClick={handleEditProduct}
              disabled={loading}
            >
              {loading ? "Завантаження..." : "Зберегти"}
            </ServiceButton>
          </div>
        )}
      </article>
    </section>
  );
}

export default withAuth(EditPage);
