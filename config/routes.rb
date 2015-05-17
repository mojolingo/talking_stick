TalkingStick::Engine.routes.draw do
  resources :rooms do
    resources :participants do
      post 'signals', to: 'rooms#signal'
    end
  end
end
