import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Trash,
  Pencil,
  MessageSquare,
  MessageCircle,
  ChevronDown,
  Gamepad2,
  Bell,
  TrendingUp,
  Users,
  Plus
} from 'lucide-angular';

const icons = {
  Trash,
  Pencil,
  MessageSquare,
  MessageCircle,
  ChevronDown,
  Gamepad2,
  Bell,
  TrendingUp,
  Users,
  Plus
};

@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
