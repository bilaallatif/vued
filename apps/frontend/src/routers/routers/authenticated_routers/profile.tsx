import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { FormInput } from "../../../components/forms.tsx";
import { BasicButton } from "../../../components/buttons.tsx";
import { useEffect, useState } from "react";
import { Default } from "@vued/sdk/api";

const Profile = () => {
  const [bio, setBio] = useState<string>("");

  const populateProfileDetails = async () => {
    const profiles_data = await Default.getMyProfile();
    if (!profiles_data.error && profiles_data.data) {
      setBio(profiles_data.data.bio);
    }
  };

  const updateProfileDetails = async () => {
    await Default.updateMyProfile({
      body: { bio },
    });
  };

  useEffect(() => {
    populateProfileDetails();
  }, []);

  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <div className={"flex flex-col px-10 w-full lg:px-0 lg:w-1/4 gap-10"}>
        <div className={"flex flex-col w-full gap-2"}>
          <FormInput name={"Bio"} value={bio} setValue={setBio} />
        </div>

        <div className={"flex flex-row justify-start w-full gap-5"}>
          <BasicButton onClick={updateProfileDetails} text={"Update"} />
        </div>
      </div>
    </div>
  );
};

export const ProfileRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "profile",
  component: Profile,
});
