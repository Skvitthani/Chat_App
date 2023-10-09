import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {navigate} from '../../navigation/NavigateRef';
import {Stringconst} from '../../utils/helper';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';
import {ImageConst} from '../../utils/helper/ImageConst';
import Groupmember from './Groupmember';

const Userprofile = props => {
  const {items, onPress, Group} = props;
  const GroupId = Group?.id;
  const group = Group?.data;
  const total = group?.GroupData;

  const admin = total.map(item => {
    if (item?.admin) {
      return item?.admin;
    }
  });

  const [showComponent, setShowComponent] = useState(false);
  const [userDetail, setUserDetail] = useState('');

  const onItemPress = item => {
    setUserDetail(item);
    setShowComponent(!showComponent);
  };

  const onAddGroupMemberPress = () => {
    navigate('Addgroupmemberscreen', {
      GroupId: GroupId,
    });
  };

  return (
    <View style={{flex: 1}}>
      {showComponent === false && (
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={onPress} style={{marginTop: hp(5)}}>
            <Image source={ImageConst.arrow_png} style={style.headerImage} />
          </TouchableOpacity>
          {group ? (
            <View style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                <Image source={{uri: group?.Photo}} style={style.groupImage} />
                <Text style={{fontSize: 20, marginTop: 10}}>
                  {group?.GroupChat}
                </Text>
                <Text style={{fontSize: 20, marginTop: 10}}>
                  {Stringconst.Group} : {total?.length}{' '}
                  {Stringconst.Participants}
                </Text>
                <TouchableOpacity
                  style={style.addMember}
                  onPress={onAddGroupMemberPress}>
                  <Image
                    source={require('../../asset/Image/plus.png')}
                    style={style.pluseImage}
                  />
                  <Text style={style.addGroupMember}>
                    {Stringconst.addGroupMember}
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                ListHeaderComponent={() => {
                  return (
                    <View>
                      <Text style={{fontSize: 18, padding: 15}}>
                        {total?.length} {Stringconst.Participants}
                      </Text>
                    </View>
                  );
                }}
                data={total}
                renderItem={({item}) => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={style.messageListStyle}
                        onPress={() => onItemPress(item)}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={{uri: item?.Photo}}
                            style={style.userProfile}
                          />
                          <Text style={style.listUserName}>{item?.name}</Text>
                        </View>
                        <Text style={style.adminStyle}>{item?.admin}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Image
                source={{uri: items?.Photo}}
                style={{
                  height: hp(20),
                  width: wp(45),
                  borderRadius: 100,
                }}
              />
              <Text style={{fontSize: 20, marginTop: 10}}>{items?.name}</Text>
            </View>
          )}
        </View>
      )}
      {showComponent && (
        <Groupmember
          onPress={onItemPress}
          userDetail={userDetail}
          group={group}
        />
      )}
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
  userProfile: {
    height: hp(6),
    width: wp(13),
    borderRadius: 50,
  },
  messageListStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  listUserName: {
    fontSize: 20,
    marginLeft: 30,
    marginTop: 3,
  },
  adminStyle: {
    marginTop: 5,
  },
  groupImage: {
    height: hp(20),
    width: wp(45),
    borderRadius: 100,
  },
  pluseImage: {
    height: hp(2),
    width: wp(4.5),
    tintColor: '#CCCCCC',
  },
  addMember: {
    flexDirection: 'row',
    height: hp(4),
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    backgroundColor: '#595959',
    marginTop: hp(2),
  },
  addGroupMember: {
    color: '#CCCCCC',
  },
});

export default Userprofile;
