import { combineReducers } from 'redux';
import LoginAuth from './LoginAuth';
import SignUpAuth from './SignUpAuth';
import CheckUserLogin from './CheckUserLogin';
import ChecLanguage from './ChecLanguage';
import GetCategories from './GetCategories';
import GetCategoriesRandom from './GetCategoriesRandom';
import GetCity from './GetCity';
import GetGovernorate from './GetGovernorate';
import GetSubCategoriesRandom from './GetSubCategoriesRandom';
import GetAds from './GetAds';
import GetSubCategories from './GetSubCategories';
import GetAddress from './GetAddress';
import StoreAddress from './StoreAddress';
import OrderStore from './OrderStore';
import GetMyOrder from './GetMyOrder';
import GetOffersOrder from './GetOffersOrder';
import AcceptOrders from './AcceptOrders';
import GetOrderChat from './GetOrderChat';
import StoreChat from './StoreChat';
import CompleteOrder from './CompleteOrder';
import GetWallet from './GetWallet';
import GetWalletLog from './GetWalletLog';
import EditProfileAuth from './EditProfileAuth';
import Term from './Term';
import Privacy from './Privacy';
import GetHelp from './GetHelp';
import GetAbout from './GetAbout';
import GetStatistic from './GetStatistic';
import LastOrderProvider from './LastOrderProvider';
import AddOffers from './AddOffers';
import MyOffersProvider from './MyOffersProvider';
import GetNotification from './GetNotification';
import CountNotification from './CountNotification';
import GetMsg from './GetMsg';
import GetChat from './GetChat';
import Chating from './Chating';
import GetCategoriesUser from './GetCategoriesUser';
import CountGetMsgNotRead from './CountGetMsgNotRead';









export default combineReducers({
    LoginAuth:LoginAuth,
    SignUpAuth:SignUpAuth,
    CheckUserLogin:CheckUserLogin,
    ChecLanguage:ChecLanguage,
    GetCategories:GetCategories,
    GetCategoriesRandom:GetCategoriesRandom,
    GetCity:GetCity,
    GetGovernorate:GetGovernorate,
    GetSubCategoriesRandom:GetSubCategoriesRandom,
    GetAds:GetAds,
    GetSubCategories:GetSubCategories,
    GetAddress:GetAddress,
    StoreAddress:StoreAddress,
    OrderStore:OrderStore,
    GetMyOrder:GetMyOrder,
    GetOffersOrder:GetOffersOrder,
    AcceptOrders:AcceptOrders,
    GetOrderChat:GetOrderChat,
    StoreChat:StoreChat,
    CompleteOrder:CompleteOrder,
    GetWallet:GetWallet,
    GetWalletLog:GetWalletLog,
    EditProfileAuth:EditProfileAuth,
    Term:Term,
    Privacy:Privacy,
    GetHelp:GetHelp,
    GetAbout:GetAbout,
    GetStatistic:GetStatistic,
    LastOrderProvider:LastOrderProvider,
    AddOffers:AddOffers,
    MyOffersProvider:MyOffersProvider,
    GetNotification:GetNotification,
    CountNotification:CountNotification,
    GetMsg:GetMsg,
    GetChat:GetChat,
    Chating:Chating,
    GetCategoriesUser:GetCategoriesUser,
    CountGetMsgNotRead:CountGetMsgNotRead
});