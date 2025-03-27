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
import type { Team } from "@/lib/types"

const formSchema = z
  .object({
    team1Id: z.string().min(1, "Selecciona la pareja 1"),
    team2Id: z.string().min(1, "Selecciona la pareja 2"),
    team1Games: z.coerce.number().min(0, "Mínimo 0 juegos").max(7, "Máximo 7 juegos"),
    team2Games: z.coerce.number().min(0, "Mínimo 0 juegos").max(7, "Máximo 7 juegos"),
  })
  .refine((data) => data.team1Id !== data.team2Id, {
    message: "Las parejas deben ser diferentes",
    path: ["team2Id"],
  })
  .refine(
    (data) => {
      // Validar que el resultado sea válido para un partido de pádel
      // Un equipo debe tener 6 juegos (o 7 en caso de tie-break)
      // Si un equipo tiene 6, el otro debe tener 0-4 (o 5-6 si hay tie-break)
      return (
        (data.team1Games === 6 && data.team2Games <= 4) ||
        (data.team2Games === 6 && data.team1Games <= 4) ||
        (data.team1Games === 7 && (data.team2Games === 5 || data.team2Games === 6)) ||
        (data.team2Games === 7 && (data.team1Games === 5 || data.team1Games === 6))
      )
    },
    {
      message: "El resultado debe ser válido (6-0, 6-1, 6-2, 6-3, 6-4, 7-5, 7-6, etc.)",
      path: ["team1Games"],
    },
  )

export default function AddResultForm() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team1Id: "",
      team2Id: "",
      team1Games: 0,
      team2Games: 0,
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
      await addMatchResult(values)
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
                name="team1Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pareja 1</FormLabel>
                    <Select disabled={isLoadingTeams} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una pareja" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
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
                name="team2Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pareja 2</FormLabel>
                    <Select disabled={isLoadingTeams} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una pareja" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
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
                name="team1Games"
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
                name="team2Games"
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

