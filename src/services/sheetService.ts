import type { UserItem } from "@/schema/schemas";

const GAS_URL = import.meta.env.VITE_GAS_URL;

export const fetchUsers = async (): Promise<UserItem[]> => {
    const response = await fetch(GAS_URL);
    const result = await response.json();

    if (result.status !== "success") {
        throw new Error("Gagal mengambil data dari Sheets");
    }
    
    return result.data;
};