import notifee from '@notifee/react-native';

const Customnotifee = async (title, message, image, CallId) => {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  notifee.displayNotification({
    title: title,
    body: message,
    data: {
      title: CallId,
    },
    android: {
      largeIcon: image,
      channelId,
      actions: [
        {
          title: 'Accept',
          pressAction: {
            id: 'Accept',
            launchActivity: 'default',
          },
        },
        {
          title: 'Reject',
          pressAction: {
            id: 'Reject',
          },
        },
      ],
    },
  });
};

const requestNotification = async (title, message, image) => {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  notifee.displayNotification({
    title: title,
    body: message,
    android: {
      largeIcon: image,
      channelId,
      actions: [
        {
          title: 'Accept',
          pressAction: {
            id: 'Accept',
            launchActivity: 'default',
          },
        },
        {
          title: 'Reject',
          pressAction: {
            id: 'Reject',
          },
        },
      ],
    },
  });
};

export default {Customnotifee, requestNotification};
