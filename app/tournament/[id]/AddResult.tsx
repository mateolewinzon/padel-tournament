import AddResultForm from "@/components/add-result-form"
import { getIsAdmin } from "@/components/Protected";

export default async function AddResult() {
    const isAdmin = await getIsAdmin();

    if (!isAdmin) {
        return null;
    }
    return (
        <AddResultForm />
    )
}
