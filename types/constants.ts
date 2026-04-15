import { z } from "zod";
export const COMP_NAME = "V0Chat";

export const CompositionProps = z.object({});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {};

export const DURATION_IN_FRAMES = 1500;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
