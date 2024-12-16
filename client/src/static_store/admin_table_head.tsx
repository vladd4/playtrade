export const thead_variants: Record<string, string[]> = {
  operations: [
    `User (продавець)`,
    `User (покупець)`,
    "id Угоди",
    "Сума",
    "Статус",
  ],
  users: [`User id`, "Email", "Ім'я", "Статус верифікації", "Баланс", ""],
  managers: [`User id`, "Ім'я", "Email", "Номер телефону", "Роль", ""],
  advertisement: [
    `Назва`,
    "Категорія (гра)",
    "User",
    "Вартість",
    "Тип товару",
    "",
  ],
  games: [`Назва`, "Опис", "Платформи", "Регіони", "Сервери", ""],
};
