export const zustandStorage = {
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value ? value : null;
  },
  setItem: async (key, value) => {
    await AsyncStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  },
  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
  },
};
//zustandStorage foi criado para centralizar e automatizar:
// 1) A conversão de objetos em JSON string, pois o AsyncStorage só aceita string.
// 2) O salvamento direto no AsyncStorage, sem precisar implementar get/set manualmente em cada store.
