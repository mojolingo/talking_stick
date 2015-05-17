TalkingStick::Engine.routes.draw do
  resources :rooms do
    resources :participants do
      post 'signaling', to: 'rooms#signaling', as: 'signaling'
    end
  end
end
