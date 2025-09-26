import { DefaultTheme } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

const Theme: ThemeProp = {
    ...DefaultTheme,
    "colors": {
        "primary": "rgb(0, 110, 25)",
        "onPrimary": "rgb(255, 255, 255)",
        "primaryContainer": "rgb(113, 255, 116)",
        "onPrimaryContainer": "rgb(0, 34, 3)",
        "secondary": "rgb(8, 110, 33)",
        "onSecondary": "rgb(255, 255, 255)",
        "secondaryContainer": "rgb(155, 248, 153)",
        "onSecondaryContainer": "rgb(0, 34, 4)",
        "tertiary": "rgb(0, 107, 84)",
        "onTertiary": "rgb(255, 255, 255)",
        "tertiaryContainer": "rgb(89, 252, 206)",
        "onTertiaryContainer": "rgb(0, 33, 24)",
        "error": "rgb(186, 26, 26)",
        "onError": "rgb(255, 255, 255)",
        "errorContainer": "rgb(255, 218, 214)",
        "onErrorContainer": "rgb(65, 0, 2)",
        "background": "rgb(252, 253, 246)",
        "onBackground": "rgb(26, 28, 25)",
        "surface": "rgb(252, 253, 246)",
        "onSurface": "rgb(26, 28, 25)",
        "surfaceVariant": "rgb(222, 229, 216)",
        "onSurfaceVariant": "rgb(66, 73, 64)",
        "outline": "rgb(114, 121, 111)",
        "outlineVariant": "rgb(194, 200, 189)",
        "shadow": "rgb(0, 0, 0)",
        "scrim": "rgb(0, 0, 0)",
        "inverseSurface": "rgb(47, 49, 45)",
        "inverseOnSurface": "rgb(241, 241, 235)",
        "inversePrimary": "rgb(51, 228, 75)",
        "elevation": {
            "level0": "transparent",
            "level1": "rgb(239, 246, 235)",
            "level2": "rgb(232, 242, 228)",
            "level3": "rgb(224, 237, 222)",
            "level4": "rgb(222, 236, 220)",
            "level5": "rgb(217, 233, 215)"
        },
        "surfaceDisabled": "rgba(26, 28, 25, 0.12)",
        "onSurfaceDisabled": "rgba(26, 28, 25, 0.38)",
        "backdrop": "rgba(44, 50, 42, 0.4)"
    }

}

export default Theme