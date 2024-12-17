"use client";

import styles from "./CreatePage.module.scss";

import { jost, mont } from "@/font";

import { useEffect, useRef, useState } from "react";

import InputBlock from "@/components/InputBlock/InputBlock";
import ServiceButton from "@/components/ServiceButtons/ServiceButton";
import SelectBlock from "@/components/SelectBlock/SelectBlock";

import toast from "react-hot-toast";

import { Image, X } from "lucide-react";

import withAuth from "@/utils/withAuth";
import { parseGroupedGamesToOptions } from "@/utils/groupGamesByLetter";

import {
  handleFileChange,
  handleCreateFormChange,
  resetCreateFormState,
} from "@/utils/productCreateEdit_helpers";
import { formatImageName } from "@/utils/formatImageName";

import { product_types } from "@/static_store/product_types";

import useGames from "@/hooks/useGames";

import isNumeric from "validator/lib/isNumeric";

import { privateAxios } from "@/http/axios";

import { useRouter } from "next/navigation";
import { MAX_IMAGES, ProductType, TOAST_DURATION } from "@/utils/constants";
import { useAppSelector } from "@/hooks/redux-hooks";

interface GameOptions {
  label: string;
  value: string;
  regions: { label: string; value: string }[];
  servers: { label: string; value: string }[];
  platforms: { label: string; value: string }[];
}

function CreatePage() {
  const [form, setForm] = useState({
    name: "",
    game: "",
    productType: "",
    server: "",
    region: "",
    platform: "",
    description: "",
    fullDescription: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  const [gameOptions, setGameOptions] = useState<GameOptions[]>([]);
  const [serverOptions, setServerOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [regionOptions, setRegionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [platformOptions, setPlatformOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { data, isLoading } = useGames();

  const { userId } = useAppSelector((state) => state.user);

  const updateOptions = (selectedGameValue: string) => {
    const selectedGame = gameOptions.find(
      (game) => game.value === selectedGameValue
    );
    if (selectedGame) {
      setServerOptions(selectedGame.servers);
      setRegionOptions(selectedGame.regions);
      setPlatformOptions(selectedGame.platforms);
    } else {
      setServerOptions([]);
      setRegionOptions([]);
      setPlatformOptions([]);
    }
  };

  const handleImageClick = () => {
    if (uploadedImages.length >= MAX_IMAGES) {
      toast.error(`Максимальна кількість фотографій ${MAX_IMAGES}`);
    } else {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (!isLoading && data) {
      const { options } = parseGroupedGamesToOptions(data);
      setGameOptions(options);
    }
  }, [data, isLoading]);

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

  const handleAddProduct = async () => {
    if (!validateForm() || !userId) return;

    setLoading(true);
    const formData = new FormData();

    const prodType = form.productType as ProductType;

    formData.append("gameId", form.game);
    formData.append("type", prodType);
    formData.append("description", form.description.trim());
    formData.append("detailDescription", form.fullDescription.trim());
    formData.append("ownerId", userId);
    formData.append("platform", form.platform);
    formData.append("server", form.server);
    formData.append("region", form.region);
    formData.append("price", form.price);
    formData.append("name", form.name.trim());

    uploadedImages.forEach((file) => {
      formData.append("images", file, file.name);
    });

    try {
      const result = await privateAxios.post("/products", formData);
      if (result.data !== null && result.status === 201) {
        resetCreateFormState(setForm);
        setUploadedImages([]);

        toast.success("Продукт успішно доданий!");
        setTimeout(() => {
          router.push("/profile/products");
        }, TOAST_DURATION);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      toast.error("Щось пішло не так! Спробуйте пізніше");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !gameOptions) return null;

  return (
    <section className={styles.root}>
      <article className={styles.wrapper}>
        <h1 className={mont.className}>Створити оголошення</h1>
        <div className={styles.inputs_block}>
          <SelectBlock
            name="game"
            value={form.game}
            options={gameOptions}
            label="Оберіть гру"
            onStateChange={(e) => {
              handleCreateFormChange(e, setForm);
              updateOptions(e.target.value);
            }}
            defaultValue={{
              label: "Наприклад: CS GO 2",
              value: "placeholder",
            }}
          />
          <SelectBlock
            name="productType"
            value={form.productType}
            options={product_types}
            label="Оберіть товар"
            onStateChange={(e) => handleCreateFormChange(e, setForm)}
            defaultValue={{
              label: "Наприклад: Аккаунт",
              value: "placeholder",
            }}
          />
          <SelectBlock
            name="server"
            value={form.server}
            options={serverOptions}
            label="Оберіть сервер"
            onStateChange={(e) => handleCreateFormChange(e, setForm)}
            defaultValue={{
              label: "Наприклад: Ukraine",
              value: "placeholder",
            }}
          />
          <SelectBlock
            name="region"
            value={form.region}
            options={regionOptions}
            label="Оберіть регіон"
            onStateChange={(e) => handleCreateFormChange(e, setForm)}
            defaultValue={{
              label: "Наприклад: Ukraine",
              value: "placeholder",
            }}
          />
          <SelectBlock
            name="platform"
            value={form.platform}
            options={platformOptions}
            label="Оберіть платформу"
            onStateChange={(e) => handleCreateFormChange(e, setForm)}
            defaultValue={{
              label: "Наприклад: PC",
              value: "placeholder",
            }}
          />
          <InputBlock
            name="name"
            value={form.name}
            placeholder="Наприклад: Gaming Mouse"
            label="Назва"
            setValue={(e) => handleCreateFormChange(e, setForm)}
          />
          <InputBlock
            name="description"
            value={form.description}
            placeholder="Наприклад: Продається унікальний аккаунт"
            label="Опис"
            setValue={(e) => handleCreateFormChange(e, setForm)}
            isTextArea
          />
          <InputBlock
            name="fullDescription"
            value={form.fullDescription}
            placeholder="Детальний опис товару"
            label="Детальний опис"
            setValue={(e) => handleCreateFormChange(e, setForm)}
            isTextArea
            isFull
          />
          <div className={styles.image_block} onClick={handleImageClick}>
            <Image size={50} />
            <p className={jost.className}>Додати зображення</p>
          </div>
          <div className={styles.preview_images}>
            {uploadedImages.length > 0 &&
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, setUploadedImages)}
          />
          <InputBlock
            name="price"
            value={form.price}
            placeholder="Наприклад: 50$"
            label="Ціна"
            setValue={(e) => handleCreateFormChange(e, setForm)}
          />
          <ServiceButton
            isActive
            className={styles.btn}
            onClick={handleAddProduct}
            disabled={loading}
          >
            {loading ? "Завантаження..." : "Створити"}
          </ServiceButton>
        </div>
      </article>
    </section>
  );
}

export default withAuth(CreatePage);
