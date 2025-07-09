import { CommonProps } from '@/types/common-props';
import {
  type Infer,
  assign,
  object,
  boolean,
} from 'superstruct';


export const DashboardHomeProps = assign(
  object({
    ok: boolean(),
  }),
  CommonProps,
);

export type DashboardHomeProps = Infer<typeof DashboardHomeProps>;
