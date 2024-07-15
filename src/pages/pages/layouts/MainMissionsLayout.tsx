import useConfigMountEffect from 'hooks/useConfigMountEffect';
import useSettingsMountEffect from 'hooks/useSettingsMountEffect';
import Missions from 'pages/missions/Missions';

const MainMissionsLayout = () => {
    useSettingsMountEffect({
        disableNavigationType: true,
        disableHorizontalNavbarAppearance: true,
        disableVerticalNavbarAppearance: true,
        disableHorizontalNavbarShape: true,
        disableResetButton: true
    });

    useConfigMountEffect({
        theme: 'dark'
    });

    return <Missions />;
};

export default MainMissionsLayout;
