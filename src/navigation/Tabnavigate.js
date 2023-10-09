import React, {useState} from 'react';
import Homescreen from '../screen/tabscreen/Homescreen';
import Groupchatscreen from '../screen/tabscreen/Groupchatscreen';
import Callscreen from '../screen/tabscreen/Callscreen';
import {TabView, SceneMap} from 'react-native-tab-view';
import {StyleSheet} from 'react-native';
import {View, TouchableOpacity, Animated} from 'react-native';
import {Customheader} from '../components/Index';
import Statusscreen from '../screen/tabscreen/Statusscreen';

const renderScene = SceneMap({
  first: Homescreen,
  second: Groupchatscreen,
  fourth: Statusscreen,
  thired: Callscreen,
});

const Tabnavigate = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'first', title: 'Chat'},
    {key: 'second', title: 'Group'},
    {key: 'fourth', title: 'Status'},
    {key: 'thired', title: 'Call'},
  ]);

  const handletextChange = index => setIndex(index);

  const renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <View style={style.tabBar}>
        {props.navigationState.routes.map((routes, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputText =>
              inputText === i ? 1 : 0.5,
            ),
          });
          return (
            <TouchableOpacity style={style.tabItem} onPress={() => setIndex(i)}>
              <Animated.Text style={{opacity, fontSize: 20, color: 'white'}}>
                {routes?.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Customheader />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={handletextChange}
        renderTabBar={renderTabBar}
      />
    </>
  );
};

const style = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2B2D5E',
  },
});

export default Tabnavigate;
