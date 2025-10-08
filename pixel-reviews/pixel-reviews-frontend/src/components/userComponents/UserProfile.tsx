import { Card } from "../luxe/card";
import { Avatar, AvatarImage, AvatarFallback } from "../luxe/avatar";
import { Button } from "../luxe/button";
import { Badge } from "../ui/badge";
import { SquarePen, Calendar, Link, MapPin, Star } from "lucide-react";
import type { User } from "@/types/userTypes";

interface UserProfileCardProps {
  user: User | null
  ownProfile?: boolean
}

function UserProfile({user, ownProfile=false}: UserProfileCardProps) {
  return (
    <Card className="flex grid-rows-1 m-auto w-7xl p-10 font-exo">
      {/*Avatar Image and edit button */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <Avatar hasBorder className="size-45">
          {/*aca luego se pone la foto del usuario, cuando se implememnte la funcion */}
          <AvatarImage src="https://img.freepik.com/vector-premium/imagen-perfil-avatar-hombre-aislada-fondo-imagen-profil-avatar-hombre_1293239-4857.jpg" />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
        {ownProfile && <Button className="w-fit">
          <span className="flex items-center gap-2">
            <SquarePen className="w-4 h-4" />
            Editar Perfil
          </span>
        </Button>}
      </div>

      {/*User info and stadistic */}
      <div className="flex-4 columns-1">
        <div className="flex gap-3 mb-4">
          <h2 className="text-4xl font-orbitron font-bold">{user?.username}</h2>
          <div className="flex items-center">
            <Badge variant={"secondary"} className="text-base">
              Verified
            </Badge>
            <Badge className="text-base">Verified</Badge>
          </div>
        </div>
        <div className="flex mb-4">
          {/*aca luego se pone la descripcion del usuario */}
          <p className="text-xl text-muted-foreground">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est in
            totam aperiam corporis maxime nulla error adipisci qui fugit rerum,
            dolorum placeat minima laborum commodi! Eveniet reprehenderit fugit
            rem assumenda?
          </p>
        </div>
        <div className="columns-2 mb-4 text-lg">
          <div className="flex flex-col gap-4">
            <span className="flex gap-2 items-center text-muted-foreground">
              <Calendar size={18} />
              {user?.createdAt}
            </span>
            <span className="flex gap-2 items-center text-muted-foreground">
              <Link size={18} />
              link de red social
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="flex gap-2 items-center text-muted-foreground">
              <MapPin size={18} /> ciudad
            </span>
            <span className="flex gap-2 items-center text-muted-foreground">
              <Star size={18} /> calificacion promedio
            </span>
          </div>
        </div>
        {/* Contenedor principal: flex para alinear estadísticas a la izquierda y botón a la derecha */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Estadísticas: flex para alinearlas horizontalmente */}
          <div className="flex gap-8">
            {/* Cada estadística: flex-col para número arriba y texto abajo */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">10</span>
              <span className="text-base text-muted-foreground">
                suscriptores
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">10</span>
              <span className="text-base text-muted-foreground">seguidos</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">10</span>
              <span className="text-base text-muted-foreground">likes</span>
            </div>
          </div>

          {/* Botón: automáticamente se alinea a la derecha por justify-between */}
          <Button>Seguir</Button>
        </div>
        <div className="flex flex-col gap-2 ">
          <h3 className="text-lg">Generos favoritos</h3>
          <div className="flex gap-2">
            <Badge className="text-base" variant={"secondary"}>
              Souls
            </Badge>
            <Badge className="text-base" variant={"secondary"}>
              Terror
            </Badge>
            <Badge className="text-base" variant={"secondary"}>
              Deportes
            </Badge>
            <Badge className="text-base" variant={"secondary"}>
              Drama
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UserProfile;
