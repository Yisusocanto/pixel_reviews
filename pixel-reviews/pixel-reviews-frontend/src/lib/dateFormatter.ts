import daysjs from "dayjs";
import "dayjs/locale/es";

daysjs.locale("es");

export const dateFormatter = (date: string) => {
  const cleanDate = daysjs(date).format("D [de] MMMM [de] YYYY");
  return cleanDate;
};
