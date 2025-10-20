import { ApplicationStage } from "@/drizzle/schemas";
import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleXIcon,
  HandshakeIcon,
  SpeechIcon,
} from "lucide-react";
import { ComponentPropsWithRef } from "react";

export function StageIcon({
  stage,
  ...props
}: { stage: ApplicationStage } & ComponentPropsWithRef<typeof CircleHelpIcon>) {
  const Icon = getIcon(stage);

  return <Icon {...props} />;
}

function getIcon(stage: ApplicationStage) {
  switch (stage) {
    case "applied":
      return CircleHelpIcon;
    case "interested":
      return CircleCheckIcon;
    case "interviewed":
      return SpeechIcon;
    case "hired":
      return HandshakeIcon;
    case "denied":
      return CircleXIcon;

    default:
      throw new Error(`Invalid Application Stage ${stage satisfies never}`);
  }
}
