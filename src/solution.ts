import type { Category, CategoryListElement } from './types';

const SHOW_ON_HOME_MARK = '#';

const SHOW_ON_HOME_ALL_LIMIT = 5;
const SHOW_ON_HOME_LIMIT = 3;

/**
 * Extracts the order from the Title or fallback id.
 */
export const extractOrder = (title: string, id: number): number => {
  const orderStr = title.includes(SHOW_ON_HOME_MARK)
    ? title.split('#')[0]
    : title;
  const order = parseInt(orderStr, 10);

  if (isNaN(order)) {
    return id;
  }

  return order;
};

/**
 * Checks whenever category should be on home screen based on root and title.
 */
export const shouldShowOnHomeScreen = (
  isRootCategory: boolean,
  title: string
) => {
  if (!isRootCategory) {
    return false;
  }
  return title.includes(SHOW_ON_HOME_MARK);
};

/**
 * Determine which categories to display on the home page.
 */
export const determineCategoriesOnHomePage = (
  categories: CategoryListElement[]
) => {
  if (categories.length <= SHOW_ON_HOME_ALL_LIMIT) {
    categories.forEach((category) => (category.showOnHome = true));
  } else if (!categories.find((x) => x.showOnHome)) {
    categories
      .slice(0, SHOW_ON_HOME_LIMIT)
      .forEach((category) => (category.showOnHome = true));
  }

  return categories;
};

/**
 * Recursively maps categories into the desired structure.
 */
const mapCategories = (
  categories: Category[],
  isRootCategory = false
): CategoryListElement[] => {
  return categories
    .map((category) => {
      const order = extractOrder(category.Title, category.id);
      const showOnHome = shouldShowOnHomeScreen(isRootCategory, category.Title);
      const children = mapCategories(category.children);

      return {
        id: category.id,
        name: category.name,
        image: category.MetaTagDescription,
        order,
        children,
        showOnHome,
      };
    })
    .sort((a, b) => a.order - b.order);
};

export const categoryTree = async (
  getCategories: () => Promise<{ data: Category[] }>
): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res.data) {
    return [];
  }

  const result = mapCategories(res.data, true);

  return determineCategoriesOnHomePage(result);
};
