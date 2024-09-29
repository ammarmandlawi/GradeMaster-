import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import FullScreenLoader from './FullScreenLoader';
import { getMeAPI } from '../redux/features/getMeAPI';

const RequiredUser = () => {
    const [cookies] = useCookies(['isLoggedIn']);
    const location = useLocation();
    const { isLoading, isFetching } = getMeAPI.endpoints.getMe.useQuery(null, {
        skip: false,
        refetchOnMountOrArgChange: true,
    });

    const loading = isLoading || isFetching;

    const user = getMeAPI.endpoints.getMe.useQueryState(null, {
        selectFromResult: ({ data }) => data,
    });

    if (loading) {
        return <FullScreenLoader />;
    }

    return cookies.isLoggedIn || user ? (
        <Outlet />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};

export default RequiredUser;
