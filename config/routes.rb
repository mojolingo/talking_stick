TalkingStick::Engine.routes.draw do
  resources :rooms do
    resources :participants do
      post 'signaling', to: 'rooms#signaling', as: 'signaling'
    end
    post :session_description, to: 'talking_stick/rooms#session_description'
  end
end
