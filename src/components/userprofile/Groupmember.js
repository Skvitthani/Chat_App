import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';
import {ImageConst} from '../../utils/helper/ImageConst';

const Groupmember = props => {
  const {onPress, userDetail, group} = props;
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity onPress={onPress} style={{marginTop: hp(5)}}>
        <Image source={ImageConst.arrow_png} style={style.headerImage} />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <Image
          source={{uri: userDetail[1]?.Photo}}
          style={{
            height: hp(20),
            width: wp(45),
            borderRadius: 100,
          }}
        />
        <Text style={{fontSize: 20, marginTop: 10}}>{userDetail[1]?.name}</Text>
      </View>
      <Text style={style.aboutGroup}>About Group : </Text>
      <View style={style.groupView}>
        <Image source={{uri: group?.Photo}} style={style.groupPhoto} />
        <Text style={style.groupName}>{group?.GroupChat}</Text>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  headerImage: {
    height: 25,
    width: 25,
    marginTop: 5,
    marginLeft: 10,
  },
  aboutGroup: {
    fontSize: 20,
    marginLeft: wp(1),
  },
  groupPhoto: {
    height: hp(7),
    width: wp(16),
    borderRadius: 30,
  },
  groupView: {
    flexDirection: 'row',
    padding: 5,
  },
  groupName: {
    fontSize: 20,
    marginLeft: wp(3),
    marginTop: hp(1.58),
  },
});

export default Groupmember;
