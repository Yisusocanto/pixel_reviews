import { Link } from "react-router-dom";
// Components
import { Card } from "../luxe/card";
import { Avatar, AvatarImage, AvatarFallback } from "../luxe/avatar";
import { Button } from "../luxe/button";
// import { Badge } from "../ui/badge";
import {
  SquarePen,
  Calendar,
  Link as LucideLink,
  MapPin,
  Star,
} from "lucide-react";
// types
import type { User } from "@/types/userTypes";
// Utils
import { dateFormatter } from "@/utils/dateFormatter";

interface UserProfileCardProps {
  user?: User;
  ownProfile?: boolean;
}

function UserProfile({ user, ownProfile = false }: UserProfileCardProps) {
  return (
    <Card className="flex flex-col md:flex-row gap-4 w-full p-10">
      {/*Avatar Image and edit button */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <Avatar hasBorder className="size-30 md:size-45">
          {/* Avatar image */}
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>PP</AvatarFallback>
        </Avatar>
        {ownProfile && (
          <Button className="w-fit">
            <span className="flex items-center gap-2 font-bold text-primary">
              <SquarePen className="w-4 h-4" />
              <Link to="/settings">Edit profile</Link>
            </span>
          </Button>
        )}
      </div>

      {/*User info and stadistic */}
      <div className="flex-4 text-center">
        {/* Username and tags badges */}
        <div className="flex justify-center md:justify-start mb-4">
          <h2 className="text-xl sm:text-2xl md:text-4xl max-w-xl md:max-w-full text-center md:text-start font-orbitron font-bold">
            {user?.username}
          </h2>
          {/* Tags badges */}
          {/* {<div className="flex items-center">
            <Badge variant={"secondary"} className="text-base">
              Verified
            </Badge>
            <Badge className="text-base">Verified</Badge>
          </div>} */}
        </div>
        <div className="flex mb-4 justify-center md:justify-start">
          {/* User's bio */}
          <p className="text-lg md:text-xl text-muted-foreground">
            {user?.bio}
          </p>
        </div>
        {/* More user info */}
        <div className="grid grid-cols-1 md:grid-cols-2 mb-4 text-lg gap-2">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="flex gap-2 items-center text-muted-foreground">
              <Calendar size={18} />
              {dateFormatter(user?.createdAt || "")}
            </span>
            <span className="flex gap-2 items-center text-muted-foreground">
              <Star size={18} />{" "}
              <span>Average Rating: {user?.averageRating.toFixed(1)}</span>
            </span>
          </div>
          <div className="flex flex-col gap-2 items-center md:items-start">
            {user?.location && (
              <span className="flex gap-2 items-center text-muted-foreground">
                <MapPin size={18} /> {user?.location}
              </span>
            )}
            {user?.website && (
              <span className="flex gap-2 items-center text-muted-foreground">
                <LucideLink size={18} />
                <a
                  href={user?.website}
                  className="text-blue-400 hover:underline"
                >
                  {user?.website}
                </a>
              </span>
            )}
          </div>
        </div>
        {/* Statistics and follow button */}

        {/* Estadísticas: flex para alinearlas horizontalmente */}
        {/*
          <div className="flex items-center justify-between gap-4 mb-4">
          {<div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">10</span>
              <span className="text-base text-muted-foreground">Followers</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">10</span>
              <span className="text-base text-muted-foreground">Following</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">10</span>
              <span className="text-base text-muted-foreground">Likes</span>
            </div>
          </div>} 
          <Button>Follow</Button>
          </div>
          */}

        {/* Favorites genres */}
        {/* {<div className="flex flex-col gap-2 ">
          <h3 className="text-lg">Favorite Genres</h3>
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
        </div>} */}
      </div>
    </Card>
  );
}

export default UserProfile;
