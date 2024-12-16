"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { setShowImageViewer } from "@/redux/slices/imageViewerSlice";
import {
  getFromSessionStorage,
  setToSessionStorage,
} from "@/utils/sessionStorage_helper";
import { checkChatExistance, createChat } from "@/http/chatController";
import { updateProduct, updateProductStatus } from "@/http/productController";
import { Product } from "@/types/product.type";

import styles from "./FullGameCard.module.scss";
import { jost } from "@/font";
import ServiceButton from "../ServiceButtons/ServiceButton";
import ImageViewer from "../ImageViewer/ImageViewer";
import { Loader } from "lucide-react";
import { formatImageFromServer } from "@/utils/formatImageName";
import useUserProfile from "@/hooks/useUserProfile";
import { CreateTransaction } from "@/types/transaction.type";
import { createTransaction } from "@/http/transactionController";
import { updateBalance } from "@/http/userController";
import { privateAxios } from "@/http/axios";

interface FullGameCardProps {
  isMyProduct?: boolean;
  product: Product;
}

const FullGameCard: React.FC<FullGameCardProps> = ({
  isMyProduct,
  product,
}) => {
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransition, startTransition] = useTransition();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { userId } = useAppSelector((state) => state.user);
  const seller = JSON.parse(getFromSessionStorage("seller") ?? "{}");

  const userData = useUserProfile({ id: userId! });

  const handleShowViewer = (currentImage: string) => {
    setCurrentImage(currentImage);
    dispatch(setShowImageViewer(true));
  };

  const handleEditClick = () => {
    startTransition(() => {
      router.push(`/profile/products/edit-product/product?id=${product.id}`);
    });
  };

  const handleChangeProductStatus = async (
    productId: string,
    setToActive: boolean
  ) => {
    try {
      setIsLoading(true);
      const result = await updateProductStatus(productId, setToActive);
      if (result) {
        toast.success(
          `Оголошення ${setToActive ? "активовано" : "деактивовано"}!`
        );
        queryClient.invalidateQueries({ queryKey: [`my-products-${userId}`] });
      } else {
        toast.error("Щось пішло не так. Спробуйте пізніше.");
      }
    } catch (error) {
      console.error("Error changing product status:", error);
      toast.error("Помилка при зміні статусу продукту");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatJoin = async () => {
    startTransition(async () => {
      if (!product || !userId || !seller) return;

      try {
        const existingChat = await checkChatExistance(
          userId,
          product.ownerId,
          product.id
        );
        let chatId = existingChat?.id;

        if (!chatId) {
          const newChat = await createChat({
            ownerId: userId,
            receiverId: product.ownerId,
            productId: product.id,
          });
          chatId = newChat?.id;
        }

        if (chatId) {
          const chatInfo = {
            sellerName: seller.name,
            sellerAvatar: seller.imageUrl,
            sellerId: product.ownerId,
            productName: product.name,
            productId: product.id,
          };
          setToSessionStorage("chatInfo", JSON.stringify(chatInfo));
          router.push(`/messages/chat?chatId=${chatId}`);
        }
      } catch (error) {
        console.error("Error joining chat:", error);
        toast.error("Помилка при приєднанні до чату");
      }
    });
  };

  const handleBuyClick = async () => {
    if (!product) return;

    const toastId = toast.loading("Processing...");

    setTimeout(async () => {
      if (userData.data && userData.data.id && userData.data.balance) {
        if (userData.data.balance >= Number(product.price)) {
          const productInfo = {
            productId: product.id,
            ownerId: product.ownerId,
            buyerId: userData.data.id,
            productName: product.name,
            productPrice: product.price,
            productDescription: product.description,
          };

          const formData = new FormData();
          formData.append("buyerId", userData.data.id);

          const newTransaction: CreateTransaction = {
            amount: Number(product.price),
            senderId: userData.data.id,
            receiverId: product.ownerId,
            status: "completed",
          };

          try {
            const productResult = await privateAxios.put(
              `/products/${product.id}`,
              formData
            );

            if (productResult) {
              const transactionResult = await createTransaction(newTransaction);

              if (transactionResult) {
                const userResult = await updateBalance(
                  userData.data.id,
                  Math.floor(
                    Number(userData.data.balance - Number(product.price))
                  )
                );

                if (userResult) {
                  setToSessionStorage(
                    "product_buy_info",
                    JSON.stringify(productInfo)
                  );
                  router.push(
                    `/feedback?productId=${product.id}&sellerId=${product.ownerId}`
                  );
                }
              }
            } else {
              toast.error("Щось пішло не так. Спробуйте пізніше");
            }
          } catch (error) {
            console.error(error);
            toast.error("Щось пішло не так. Спробуйте пізніше");
          } finally {
            toast.dismiss(toastId);
          }
        } else {
          toast.error("Недостатньо коштів!");
          toast.dismiss(toastId);
        }
      } else {
        toast.error("Недійсні дані користувача!");
        toast.dismiss(toastId);
      }
    }, 1000);
  };

  const renderImages = () => {
    if (!product?.imageUrls || product?.imageUrls.length === 0) {
      return <p>Ще немає зображень</p>;
    }

    return product?.imageUrls.map((image) => (
      <div
        key={image}
        className={styles.image_div}
        style={{
          backgroundImage: `url(${
            process.env.NEXT_PUBLIC_BACKEND_API_URL
          }${formatImageFromServer(image)})`,
        }}
        onClick={() =>
          handleShowViewer(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${formatImageFromServer(
              image
            )}`
          )
        }
      />
    ));
  };

  const renderButtons = () => {
    if (isMyProduct) {
      return (
        <>
          {isTransition ? (
            <ServiceButton className={styles.btn_loader}>
              <Loader />
            </ServiceButton>
          ) : (
            <ServiceButton
              isActive
              className={`${styles.btn} ${
                product.isActive ? "" : styles.non_active
              }`}
              onClick={handleEditClick}
            >
              Редагувати
            </ServiceButton>
          )}

          {isLoading ? (
            <ServiceButton className={styles.btn_loader}>
              <Loader />
            </ServiceButton>
          ) : (
            <ServiceButton
              className={`${styles.btn} ${
                product.isActive ? "" : styles.active_btn
              }`}
              onClick={() =>
                handleChangeProductStatus(product.id, !product.isActive)
              }
              disabled={isLoading}
            >
              {product.isActive ? "Деактивувати" : "Активувати"}
            </ServiceButton>
          )}
        </>
      );
    }

    const isOwner = product?.ownerId === userId;

    return (
      <>
        <ServiceButton
          isActive
          className={`${styles.btn} ${isOwner ? styles.disabled : ""}`}
          disabled={isOwner}
          onClick={handleBuyClick}
        >
          Купити
        </ServiceButton>
        <ServiceButton
          className={`${styles.btn} ${isOwner ? styles.disabled : ""}`}
          disabled={isOwner}
          onClick={handleChatJoin}
        >
          {isTransition ? "Завантаження..." : "Написати продавцю"}
        </ServiceButton>
      </>
    );
  };

  if (!product) return null;

  return (
    <>
      <div
        className={`${styles.root} ${jost.className} ${
          isMyProduct && product.inProcess ? styles.sold : ""
        }`}
      >
        <h1
          className={
            isMyProduct ? (product.isActive ? "" : styles.non_active) : ""
          }
        >
          {product?.name}
        </h1>
        <div
          className={`${styles.short_info} ${
            isMyProduct ? (product.isActive ? "" : styles.non_active) : ""
          }`}
        >
          <p
            className={`${styles.label} ${
              isMyProduct ? (product.isActive ? "" : styles.non_active) : ""
            }`}
          >
            Опис:
          </p>
          <p>{product?.description}</p>
        </div>
        <div
          className={`${styles.full_info} ${
            isMyProduct ? (product.isActive ? "" : styles.non_active) : ""
          }`}
        >
          <p className={styles.label}>Детальний опис:</p>
          {product?.detailDescription}
        </div>
        <div
          className={`${styles.images} ${
            isMyProduct ? (product.isActive ? "" : styles.non_active) : ""
          }`}
        >
          <p className={styles.label}>Зображення:</p>
          <div>{renderImages()}</div>
        </div>
        <p
          className={`${styles.price} ${
            isMyProduct ? (product.isActive ? "" : styles.non_active) : ""
          }`}
        >
          Ціна: {product?.price}$
        </p>
        {isMyProduct && product.inProcess ? (
          <p className={styles.sold_p}>Товар продано!</p>
        ) : (
          <div className={styles.buttons}>{renderButtons()}</div>
        )}
      </div>
      <ImageViewer imageSrc={currentImage} setCurrentImage={setCurrentImage} />
    </>
  );
};

export default FullGameCard;
