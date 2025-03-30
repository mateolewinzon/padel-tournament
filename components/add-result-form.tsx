"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { addMatchResult, getTeams } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { pareja, Prisma } from "@prisma/client"

const formSchema = z
  .object({
    pair1Id: z.coerce.number().min(1, "Selecciona la pareja 1"),
    pair2Id: z.coerce.number().min(1, "Selecciona la pareja 2"),
    setPair1: z.coerce.number().min(0, "Mínimo 0 juegos").max(7, "Máximo 7 juegos"),
    setPair2: z.coerce.number().min(0, "Mínimo 0 juegos").max(7, "Máximo 7 juegos"),
  })
  .refine((data) => data.pair1Id !== data.pair2Id, {
    message: "Las parejas deben ser diferentes",
    path: ["pair2Id"],
  })
  .refine(
    (data) => {
      // Validar que el resultado sea válido para un partido de pádel
      return (
        (data.setPair1 === 6 && data.setPair2 <= 4) ||
        (data.setPair2 === 6 && data.setPair1 <= 4) ||
        (data.setPair1 === 7 && (data.setPair2 === 5 || data.setPair2 === 6)) ||
        (data.setPair2 === 7 && (data.setPair1 === 5 || data.setPair1 === 6))
      )
    },
    {
      message: "El resultado debe ser válido (6-0, 6-1, 6-2, 6-3, 6-4, 7-5, 7-6, etc.)",
      path: ["setPair1"],
    },
  )

export default function AddResultForm() {
  const [teams, setTeams] = useState<Prisma.parejaGetPayload<{
    include: {
      jugador1: true,
      jugador2: true,
    }
  }>[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pair1Id: 0,
      pair2Id: 0,
      setPair1: 0,
      setPair2: 0,
    },
  })

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoadingTeams(true)
      try {
        const data = await getTeams()
        setTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las parejas",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTeams(false)
      }
    }

    fetchTeams()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await addMatchResult({
        pair1Id: values.pair1Id,
        pair2Id: values.pair2Id,
        setPair1: values.setPair1,
        setPair2: values.setPair2,
      })
      toast({
        title: "Resultado añadido",
        description: "El resultado del partido ha sido registrado correctamente",
      })
      form.reset()
    } catch (error) {
      console.error("Error adding result:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el resultado",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="bg-green-50 dark:bg-green-950">
        <CardTitle>Añadir Resultado</CardTitle>
        <CardDescription>Registra el resultado de un partido del torneo</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pair1Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pareja 1</FormLabel>
                    <Select disabled={isLoadingTeams} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una pareja" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.nombre_pareja}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pair2Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pareja 2</FormLabel>
                    <Select disabled={isLoadingTeams} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una pareja" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.nombre_pareja}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="setPair1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Juegos Pareja 1</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={7} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="setPair2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Juegos Pareja 2</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={7} {...field} />
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
                "Guardar Resultado"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}