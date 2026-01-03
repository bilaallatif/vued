import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { List } from "../../../components/list.tsx";
import { Card } from "../../../components/card.tsx";
import { useEffect, useState } from "react";
import { Default, type ProfileDetailsDto } from "@vued/sdk/api";

const UserCard = ({ username, bio }: { username: string; bio: string }) => {
  return (
    <Card>
      <div className={"w-full flex flex-col items-start"}>
        <div className={"text-3xl"}>{username}</div>
        <div className={"text-xl"}>{bio}</div>
      </div>
    </Card>
  );
};

const UsersList = () => {
  const [profiles, setProfiles] = useState<ProfileDetailsDto[]>([]);

  const populateProfiles = async () => {
    const profiles_data = await Default.getProfiles();
    if (!profiles_data.error && profiles_data.data) {
      setProfiles(profiles_data.data);
    }
  };

  useEffect(() => {
    populateProfiles();
  }, []);

  return (
    <List>
      {profiles.map((profile) => (
        <UserCard username={profile.user.username} bio={profile.bio} />
      ))}
    </List>
  );
};

const Users = () => {
  return (
    <div className={"w-full h-full flex flex-col items-center"}>
      <UsersList />
    </div>
  );
};

export const UsersRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "users",
  component: Users,
});
