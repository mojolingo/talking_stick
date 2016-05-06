TalkingStick::Engine.routes.draw do
  resources :rooms, controller: 'talking_stick/rooms' do
    resources :participants, controller: 'talking_stick/participants' do
      post 'signals', to: 'talking_stick/rooms#signal'
    end
  end
end
