import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeamForm from "@/components/team-form"
import TeamsList from "@/components/teams-list"
import Protected from "@/components/Protected"

export default function TeamsPage() {
  return (
    <Protected>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Gestión de Parejas</h1>

      <Tabs defaultValue="list" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Parejas</TabsTrigger>
          <TabsTrigger value="add">Añadir Pareja</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <TeamsList />
        </TabsContent>
        <TabsContent value="add" className="mt-6">
          <TeamForm />
        </TabsContent>
      </Tabs>
    </div>
    </Protected>
  )
}