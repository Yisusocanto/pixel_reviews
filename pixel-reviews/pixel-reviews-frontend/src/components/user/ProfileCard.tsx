import EditProfileButton from "@/components/actions/EditProfileButton";
import { Avatar, Card } from "@heroui/react";
import { dateFormatter } from "@/lib/dateFormatter";
import { orbitron } from "@/fonts/fonts";
import { Calendar, MapPin, Star, Link as LucideLink } from "lucide-react";
import { User } from "@/types/userTypes";

interface ProfileCardProps {
  username: string;
  user: User;
  classname?: string;
}

function ProfileCard({ username, user, classname }: ProfileCardProps) {
  return (
    <Card
      className={`${classname} border flex flex-col md:flex-row gap-4 py-6 px-4 md:py-10 md:px-8`}
    >
      <div className="flex-1 flex flex-col items-center gap-4">
        <Avatar className="size-30 md:size-45" color="accent" variant="soft">
          <Avatar.Image src={user.avatarUrl} />
          <Avatar.Fallback className="text-5xl">
            {user.username.slice(0, 2)}
          </Avatar.Fallback>
        </Avatar>
        <EditProfileButton username={username} classname="w-fit" />
      </div>
      <div className="flex-4 flex flex-col gap-4">
        <h1
          className={`${orbitron.className} font-bold text-xl sm:text-4xl md:text-4xl max-w-xl md:max-w-full text-center md:text-start`}
        >
          {user.username}
        </h1>
        <p className="text-lg md:text-xl text-muted text-center md:text-start">
          {user.bio}
        </p>
        <div className="text-lg grid grid-cols-1 md:grid-cols-2 text-muted">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="flex gap-2 items-center text-base md:text-lg">
              <Calendar size={18} />

              {dateFormatter(user.createdAt)}
            </span>
            <span className="flex gap-2 items-center text-base md:text-lg">
              <Star size={18} />
              Average Rating: <strong>{user.averageRating.toFixed(1)}</strong>
            </span>
          </div>
          <div className="flex flex-col gap-2 items-center md:items-start">
            {user.location && (
              <span className="flex gap-2 items-center text-base md:text-lg">
                <MapPin size={18} />
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                className="flex gap-2 items-center text-blue-500 hover:text-blue-400"
              >
                <LucideLink size={18} />
                {user.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileCard;
