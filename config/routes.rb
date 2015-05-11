TalkingStick::Engine.routes.draw do
  resources :rooms do
    resources :participants
  end
end
