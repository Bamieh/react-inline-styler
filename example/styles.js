const styles = (configs) => {
  const {theme} = configs;
  return {
    rootStyle: {
      backgroundColor: theme.colors.base,
      fontSize: 14,
      marginStart: 10,
    }
  }
}

export default styles