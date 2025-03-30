import { getIsAdmin } from "@/components/Protected";
import { TabsTrigger } from "@/components/ui/tabs";

export default async function AddResultButton() {
    const isAdmin = await getIsAdmin();

    return <TabsTrigger disabled={!isAdmin} value="add-result">Añadir Resultado</TabsTrigger>
}
