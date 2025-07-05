import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'

const TextLink = ({passstyle, children, href="/", ...props}) => {
  return (
      <Link
      href={href}
        style={[styles.link, passstyle]}
        {...props}
      >
        {children}
    </Link>
  )
}

export default TextLink

const styles = StyleSheet.create({
    link: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#006FFD', //add this to theme and replace here
    },
})