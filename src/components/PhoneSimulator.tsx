import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  Dices,
  Play,
  Users,
  Key,
  Bot,
  Trophy,
  UserCheck,
  History,
  Settings,
  ArrowLeft,
  Coins,
  Gem,
  CheckCircle2,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Palette,
  Gift,
  Wifi,
  WifiOff,
  Flame
} from 'lucide-react';
import { DeviceMode, AppThemeMode } from '../types';
import { LudoGameInteractive } from './LudoGameInteractive';
import { ProfileScreen } from './ProfileScreen';
import { CollectionsScreen } from './CollectionsScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { CreateRoomScreen, RoomLobbyScreen, JoinRoomScreen } from './RoomManagement';
import { MatchmakingModal } from './MatchmakingModal';
import { PawnSkinType } from './Pawn3D';
import { DiceSkinType } from './Dice3D';
import { BoardThemeType } from './LudoBoard3D';
import { CinematicIntro } from './CinematicIntro';
import { FriendsScreen, FriendItem } from './FriendsScreen';
import { DailyRewardsMissionsModal } from './DailyRewardsMissionsModal';
import { SettingsScreen } from './SettingsScreen';
import { GameModeSelectModal } from './GameModeSelectModal';
import { PremiumHomeLobby } from './PremiumHomeLobby';

interface PhoneSimulatorProps {
  themeMode: AppThemeMode;
  onToggleTheme: () => void;
}

type ScreenRoute = 
  | 'splash' 
  | 'login' 
  | 'home' 
  | 'game' 
  | 'create-room' 
  | 'room-lobby' 
  | 'join-room' 
  | 'profile' 
  | 'collections' 
  | 'leaderboard' 
  | 'friends'
  | 'settings';

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  themeMode,
  onToggleTheme,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('pixel_7');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('splash');
  const [authStatus, setAuthStatus] = useState<'guest' | 'google'>('google');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  
  // Customization skins & themes
  const [activePawnSkin, setActivePawnSkin] = useState<PawnSkinType>('royalGold');
  const [activeDiceSkin, setActiveDiceSkin] = useState<DiceSkinType>('royal');
  const [activeBoardTheme, setActiveBoardTheme] = useState<BoardThemeType>('midnightGold');

  // Matchmaking & Room states
  const [showMatchmakingModal, setShowMatchmakingModal] = useState(false);
  const [matchmakingPlayerCount, setMatchmakingPlayerCount] = useState<number>(4);
  const [activeRoomCode, setActiveRoomCode] = useState('JK7L9P');
  const [roomPlayersCount, setRoomPlayersCount] = useState(4);
  const [gamePlayerCount, setGamePlayerCount] = useState(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Progression & Economy
  const [coins, setCoins] = useState(8400);
  const [gems, setGems] = useState(120);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Network & Reconnection state
  const [isOnline, setIsOnline] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const handleToggleNetwork = () => {
    if (isOnline) {
      setIsOnline(false);
      setIsReconnecting(true);
      showToast('Network disconnected. Auto-reconnecting in 3s...');
      setTimeout(() => {
        setIsOnline(true);
        setIsReconnecting(false);
        showToast('Connection restored! Game state synchronized.');
      }, 3000);
    } else {
      setIsOnline(true);
      setIsReconnecting(false);
      showToast('Online mode active');
    }
  };

  const handleClaimReward = (type: 'coins' | 'gems' | 'xp', amount: number) => {
    if (type === 'coins') setCoins(c => c + amount);
    if (type === 'gems') setGems(g => g + amount);
    showToast(`Claimed +${amount} ${type.toUpperCase()}!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isDark = themeMode === 'dark';
  const [introSpeed, setIntroSpeed] = useState<'full' | 'fast'>('full');

  const handleRestart = (speed: 'full' | 'fast' = 'full') => {
    setIntroSpeed(speed);
    setCurrentRoute('splash');
  };

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthStatus('google');
      setCurrentRoute('home');
    }, 1000);
  };

  const handleGuestLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthStatus('guest');
      setCurrentRoute('home');
    }, 600);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Device Toolbar */}
      <div 
        id="device-toolbar"
        className="w-full max-w-md mb-3 px-3 py-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300"
      >
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[11px] text-amber-400">Route: /{currentRoute}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="toggle-device-phone"
            onClick={() => setDeviceMode('pixel_7')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'pixel_7' ? 'bg-amber-500 text-slate-950 font-semibold' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Google Pixel 7 / Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            id="toggle-device-tablet"
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'tablet' ? 'bg-amber-500 text-slate-950 font-semibold' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Android Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>

          <button
            id="toggle-sim-theme"
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          <button
            id="toggle-sim-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            id="toggle-sim-network"
            onClick={handleToggleNetwork}
            className={`p-1.5 rounded-lg transition-colors ${
              isOnline ? 'hover:bg-slate-800 text-emerald-400' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
            title={isOnline ? 'Network: Online (Click to simulate reconnect)' : 'Network: Reconnecting...'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 animate-pulse" />}
          </button>

          <button
            id="replay-splash-button"
            onClick={() => handleRestart('full')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1"
            title="Replay Full Cinematic Intro"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold text-amber-400">Intro</span>
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Shell */}
      <div 
        id="mobile-device-frame"
        className={`relative transition-all duration-300 border-[7px] border-slate-800/90 rounded-[44px] shadow-2xl overflow-hidden bg-slate-950 ${
          deviceMode === 'pixel_7' ? 'w-[320px] sm:w-[350px] h-[670px]' : 'w-[420px] h-[600px]'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Device Speaker & Camera Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-center gap-2 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/60"></div>
          </div>
          <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* Screen Content */}
        <div 
          className={`w-full h-full flex flex-col select-none relative transition-colors duration-300 ${
            isDark 
              ? 'bg-gradient-to-b from-[#0B0F19] via-[#111827] to-[#1E1B4B] text-slate-100' 
              : 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-slate-900'
          }`}
        >
          {/* Top Android Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[10px] font-semibold tracking-wider opacity-80 z-30">
            <span>12:28</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              {isOnline ? (
                <Wifi className="w-3 h-3 text-emerald-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-rose-400 animate-pulse" />
              )}
              <div className="w-4 h-2 border border-current rounded-xs p-[0.5px] flex items-center">
                <div className="h-full w-3 bg-current rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Reconnection Alert Banner */}
          {isReconnecting && (
            <div className="mx-3 mb-1 p-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-lg flex items-center justify-between animate-pulse z-40">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Auto-Reconnecting to Server...</span>
              </div>
              <span className="text-[9px] bg-slate-950/20 px-1 rounded font-mono">State Preserved</span>
            </div>
          )}

          {/* SCREEN ROUTE ROUTER */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* 1. HIGH-END CINEMATIC SPLASH SCREEN */}
            {currentRoute === 'splash' && (
              <div className="absolute inset-0 z-40 bg-slate-950">
                <CinematicIntro
                  speed={introSpeed}
                  onComplete={() => {
                    setCurrentRoute('home');
                    setIntroSpeed('fast');
                  }}
                />
              </div>
            )}

            {/* 2. LOGIN SCREEN */}
            {currentRoute === 'login' && (
              <div className="flex-1 flex flex-col items-center justify-between p-6">
                <div className="w-full pt-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[2px] mb-3">
                    <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                      <Dices className="w-7 h-7 text-amber-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black tracking-wider">JK LODU</h2>
                  <p className="text-xs text-slate-400 mt-1">Sign in to sync multiplayer stats & friends</p>
                </div>

                <div className="w-full flex flex-col gap-3">
                  {isAuthenticating ? (
                    <div className="py-8 flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-3 border-amber-500/30 border-t-amber-500 animate-spin"></div>
                      <span className="text-xs font-bold text-amber-400">Connecting to JK LODU...</span>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleGoogleLogin}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 bg-white text-slate-900 shadow-md hover:bg-slate-100 transition-all"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center">G</span>
                        Continue with Google
                      </button>

                      <button 
                        onClick={handleGuestLogin}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                          isDark 
                            ? 'bg-slate-900/60 border-slate-700 text-slate-200 hover:bg-slate-800' 
                            : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        Play Offline as Guest
                      </button>
                    </>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure Firebase Auth Architecture</span>
                </div>
              </div>
            )}

            {/* 3. HOME SCREEN — ADVANCED HIGH-END LOBBY */}
            {currentRoute === 'home' && (
              <PremiumHomeLobby
                authStatus={authStatus}
                avatarUrl={avatarUrl}
                coins={coins}
                gems={gems}
                isDark={isDark}
                soundEnabled={soundEnabled}
                onNavigate={(route) => setCurrentRoute(route)}
                onOpenQuickPlay={() => {
                  setMatchmakingPlayerCount(4);
                  setShowMatchmakingModal(true);
                }}
                onOpenGameModeModal={() => setShowGameModeModal(true)}
                onOpenDailyRewards={() => setShowDailyRewards(true)}
                onClaimReward={handleClaimReward}
                showToast={showToast}
                activePawnSkin={activePawnSkin}
                activeDiceSkin={activeDiceSkin}
                activeBoardTheme={activeBoardTheme}
              />
            )}

            {/* 4. GAME TABLE SCREEN */}
            {currentRoute === 'game' && (
              <LudoGameInteractive
                onBackToLobby={() => setCurrentRoute('home')}
                onOpenSettings={() => setCurrentRoute('settings')}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                pawnSkin={activePawnSkin}
                diceSkin={activeDiceSkin}
                boardTheme={activeBoardTheme}
                playerCount={gamePlayerCount}
              />
            )}

            {/* 5. CREATE ROOM SCREEN */}
            {currentRoute === 'create-room' && (
              <CreateRoomScreen
                onBack={() => setCurrentRoute('home')}
                onCreateSuccess={(code, count) => {
                  setActiveRoomCode(code);
                  setRoomPlayersCount(count);
                  setCurrentRoute('room-lobby');
                  showToast(`Room ${code} created!`);
                }}
              />
            )}

            {/* 6. ROOM LOBBY SCREEN */}
            {currentRoute === 'room-lobby' && (
              <RoomLobbyScreen
                roomCode={activeRoomCode}
                maxPlayers={roomPlayersCount}
                onLeave={() => setCurrentRoute('home')}
                onStartGame={() => {
                  setGamePlayerCount(roomPlayersCount);
                  setCurrentRoute('game');
                }}
              />
            )}

            {/* 7. JOIN ROOM SCREEN */}
            {currentRoute === 'join-room' && (
              <JoinRoomScreen
                onBack={() => setCurrentRoute('home')}
                onJoinSuccess={(code) => {
                  setActiveRoomCode(code);
                  showToast(`Connected to room ${code}!`);
                  setGamePlayerCount(4);
                  setCurrentRoute('game');
                }}
              />
            )}

            {/* 8. PROFILE SCREEN */}
            {currentRoute === 'profile' && (
              <ProfileScreen
                onBack={() => setCurrentRoute('home')}
                avatarUrl={avatarUrl}
                onUpdateAvatar={(newUrl) => {
                  setAvatarUrl(newUrl);
                  showToast('Avatar updated!');
                }}
                onLogout={() => {
                  setAuthStatus('guest');
                  setCurrentRoute('login');
                }}
              />
            )}

            {/* 9. COLLECTIONS SCREEN (SKINS & THEMES) */}
            {currentRoute === 'collections' && (
              <CollectionsScreen
                onBack={() => setCurrentRoute('home')}
                activePawnSkin={activePawnSkin}
                onSelectPawnSkin={(skin) => {
                  setActivePawnSkin(skin);
                  showToast('Pawn skin equipped!');
                }}
                activeDiceSkin={activeDiceSkin}
                onSelectDiceSkin={(skin) => {
                  setActiveDiceSkin(skin);
                  showToast('Dice skin equipped!');
                }}
                activeBoardTheme={activeBoardTheme}
                onSelectBoardTheme={(theme) => {
                  setActiveBoardTheme(theme);
                  showToast('Board theme selected!');
                }}
              />
            )}

            {/* 10. LEADERBOARD SCREEN */}
            {currentRoute === 'leaderboard' && (
              <LeaderboardScreen
                onBack={() => setCurrentRoute('home')}
                onInviteFriend={(name) => {
                  showToast(`Invitation sent to ${name}!`);
                }}
              />
            )}

            {/* 11. FRIENDS & SOCIAL SCREEN */}
            {currentRoute === 'friends' && (
              <FriendsScreen
                onBack={() => setCurrentRoute('home')}
                onInviteToGame={(friend) => {
                  showToast(`Game invite sent to ${friend.name}!`);
                  setMatchmakingPlayerCount(4);
                  setShowMatchmakingModal(true);
                }}
              />
            )}

            {/* 12. SETTINGS SCREEN */}
            {currentRoute === 'settings' && (
              <SettingsScreen
                onBack={() => setCurrentRoute('home')}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                musicEnabled={musicEnabled}
                onToggleMusic={() => setMusicEnabled(!musicEnabled)}
                isDark={isDark}
                onToggleTheme={onToggleTheme}
                authStatus={authStatus}
                onLogout={() => {
                  setAuthStatus('guest');
                  setCurrentRoute('login');
                }}
                onReplayIntro={() => handleRestart('full')}
              />
            )}
          </div>

          {/* Quick Play Matchmaking Modal */}
          {showMatchmakingModal && (
            <MatchmakingModal
              playerCount={matchmakingPlayerCount}
              onCancel={() => setShowMatchmakingModal(false)}
              onMatchFound={() => {
                setShowMatchmakingModal(false);
                setGamePlayerCount(matchmakingPlayerCount);
                setCurrentRoute('game');
              }}
            />
          )}

          {/* Daily Rewards & Missions Modal */}
          {showDailyRewards && (
            <DailyRewardsMissionsModal
              coins={coins}
              onClose={() => setShowDailyRewards(false)}
              onClaimReward={handleClaimReward}
            />
          )}

          {/* Game Mode Selector Modal */}
          {showGameModeModal && (
            <GameModeSelectModal
              onClose={() => setShowGameModeModal(false)}
              onSelectQuickPlay={(count) => {
                setShowGameModeModal(false);
                setMatchmakingPlayerCount(count);
                setShowMatchmakingModal(true);
              }}
              onSelectCreateRoom={() => {
                setShowGameModeModal(false);
                setCurrentRoute('create-room');
              }}
              onSelectJoinRoom={() => {
                setShowGameModeModal(false);
                setCurrentRoute('join-room');
              }}
              onSelectAiGame={(count, difficulty) => {
                setShowGameModeModal(false);
                setGamePlayerCount(count);
                showToast(`Starting vs ${difficulty.toUpperCase()} AI`);
                setCurrentRoute('game');
              }}
              onSelectLocalPlay={(count) => {
                setShowGameModeModal(false);
                setGamePlayerCount(count);
                showToast(`Starting Local Pass & Play (${count}P)`);
                setCurrentRoute('game');
              }}
            />
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Android Bottom Navigation Pill */}
          <div className="pb-3 px-6 flex justify-center z-30">
            <div className="w-28 h-1 bg-slate-500/40 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          Mobile-First Responsive Shell • Material 3 Navigation
        </span>
      </div>
    </div>
  );
};
