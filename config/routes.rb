TalkingStick::Engine.routes.draw do
  resources :rooms do
    resources :participants
    post :session_description, to: 'talking_stick/rooms#session_description'
  end
end
