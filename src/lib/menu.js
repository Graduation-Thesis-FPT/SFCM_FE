import { MAIN_MENU } from "@/constants/menu";

export const categorizedMenu = menu => {
  let mainMenu = [];
  let toolMenu = [];

  mainMenu = menu.filter(item => MAIN_MENU.includes(item.MENU_CODE));
  toolMenu = menu.filter(item => !MAIN_MENU.includes(item.MENU_CODE));

  return { mainMenu, toolMenu };
};

export const getRoutes = menu => {
  let routes = [];
  menu.forEach(parent => {
    if (parent?.child?.length !== 0) {
      parent.child.forEach(child => {
        routes.push({ path: `/${parent.MENU_CODE}/${child.MENU_CODE}`, element: child.VIEW_PAGE });
      });
    }
  });
  return routes;
};
