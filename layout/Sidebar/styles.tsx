export const navItemStyle = {
  width: '22px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const flexBtwCenter = {
  // display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export function getTitleNavClassName(
  currentRouter: { pathname: string | never[]; },
  to: any,
  isOpen: any,
  padding: any,
  subActiveLinks = [],
) {
  const isActiveNav =
    currentRouter?.pathname === to ||
    subActiveLinks.find((link) => currentRouter?.pathname.includes(link));
  return `title_nav ${isActiveNav ? 'active' : ''} ${isOpen ? 'nav-open' : 'nav-close'} ${
    isOpen && padding ? 'pd30' : 'pd0'
  }`;
}
