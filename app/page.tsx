import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StandingsTable from "@/components/standings-table"
import AddResultForm from "@/components/add-result-form"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Torneo de Pádel</h1>

      <Tabs defaultValue="standings" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standings">Clasificación</TabsTrigger>
          <TabsTrigger value="add-result">Añadir Resultado</TabsTrigger>
        </TabsList>
        <TabsContent value="standings" className="mt-6">
          <StandingsTable />
        </TabsContent>
        <TabsContent value="add-result" className="mt-6">
          <AddResultForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

