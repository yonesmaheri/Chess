import { getInitials } from "../../lib/utils";

type InstructorAvatarProps = {
  name: string;
  avatarImage: string;
};

export default function InstructorAvatar({
  name,
  avatarImage,
}: InstructorAvatarProps) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#DDE4DE] bg-[#F6F8F5] text-sm font-semibold text-[#547C5F]">
      {avatarImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${avatarImage})` }}
        />
      ) : null}
      <span className="relative z-10 bg-white/80 px-1 backdrop-blur-sm">
        {getInitials(name)}
      </span>
    </div>
  );
}
