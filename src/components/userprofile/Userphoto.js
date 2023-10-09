import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {hp, ImageConst, wp} from '../../utils/helper/index';

const Userphoto = ({onPress, Photo}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image source={ImageConst.arrow_png} style={styles.headerImage} />
      </TouchableOpacity>
      <View style={styles.imageView}>
        <Image source={{uri: Photo}} style={styles.userPhoto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    height: hp(3),
    width: wp(8),
    marginTop: hp(2),
    marginLeft: wp(2),
  },
  userPhoto: {
    height: hp(80),
    width: wp(97),
  },
  imageView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Userphoto;
