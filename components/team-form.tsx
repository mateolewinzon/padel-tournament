"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
// import { addTeam } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  teamName: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(50, "El nombre es demasiado largo"),
  player1: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(30, "El nombre es demasiado largo"),
  player2: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(30, "El nombre es demasiado largo"),
})

export default function TeamForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      player1: "",
      player2: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // await addTeam(values)
      toast({
        title: "Pareja añadida",
        description: "La pareja ha sido registrada correctamente",
      })
      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error adding team:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la pareja",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="bg-green-50 dark:bg-green-950">
        <CardTitle>Añadir Pareja</CardTitle>
        <CardDescription>Registra una nueva pareja para el torneo</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Pareja</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Los Campeones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="player1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del jugador 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="player2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del jugador 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Pareja"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

