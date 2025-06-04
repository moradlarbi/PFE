function createGradient(color1, color2) {
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }
  
  const SHADES = {
    0: "#FFFFFF",
    100: "#F5F5F5",
    200: "#1976D2",
    300: "#E8F3FF",
  };
  
  const PRIMARY = {
  light: "#E8F3FF",       // soft minty green for backgrounds
  main: "#2E8B57",        // SeaGreen (primary action color)
  dark: "#000",        // deeper version of main
  darker: "#000000",      // even deeper, good for text on light
  contrastText: "#fff",   // white for buttons on green
};

const SECONDARY = {
  lighter: "#F4F4F4",     // soft gray for UI elements
  light: "#DDE2DE",       // very light green-gray
  main: "#6A6A6A",        // OliveDrab – muted contrast green
  dark: "#000",        // dark olive, could be used for hover
  contrastText: "#fff",   // or "#000" if using on very light bg
};

  
  const INFO = {
    lighter: "#D0F2FF",
    light: "#74CAFF",
    main: "#1890FF",
    dark: "#0C53B7",
    darker: "#04297A",
    contrastText: "#fff",
  };
  
  const SUCCESS = {
    lighter: "#E9FCD4",
    light: "#AAF27F",
    main: "#66BB6A",
    dark: "#229A16",
    darker: "#08660D",
    contrastText: "#fff",
  };
  
  const WARNING = {
    lighter: "#FFF7CD",
    light: "#FFE16A",
    main: "#ED6C02",
    dark: "#B78103",
    darker: "#7A4F01",
    dialog: "#EF7E21",
    datagrid: "#FFF0F0",
    contrastText: "#fff",
  };
  
  const ERROR = {
    lighter: "#FFE7D9",
    light: "#FFA48D",
    main: "#FF2828",
    dark: "#B72136",
    dialog: "#FF5A5A",
    darker: "#7A0C2E",
    contrastText: "#fff",
  };
  const GRADIENTS = {
    primary: createGradient(SECONDARY.lighter, SECONDARY.light),
  };
  
  export const palette = {
    primary: {
      ...PRIMARY,
    },
  
    secondary: {
      ...SECONDARY,
    },
    info: { ...INFO },
    success: { ...SUCCESS },
    warning: { ...WARNING },
    error: { ...ERROR },
    grey: SHADES,
    gradients: GRADIENTS,
  };