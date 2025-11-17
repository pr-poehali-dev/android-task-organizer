import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Task = {
  id: string;
  title: string;
  note: string;
  completed: boolean;
  category: string;
  dayOfWeek: number;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Работа', color: '#0EA5E9' },
  { id: '2', name: 'Личное', color: '#8B5CF6' },
  { id: '3', name: 'Здоровье', color: '#10B981' },
  { id: '4', name: 'Покупки', color: '#F97316' },
];

export default function Index() {
  const [currentDay, setCurrentDay] = useState(new Date().getDay() || 7);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Утренняя зарядка', note: '15 минут', completed: true, category: '3', dayOfWeek: 1 },
    { id: '2', title: 'Созвон с командой', note: 'Обсудить новый проект', completed: false, category: '1', dayOfWeek: 1 },
    { id: '3', title: 'Купить продукты', note: '', completed: false, category: '4', dayOfWeek: 1 },
  ]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeSection, setActiveSection] = useState('tasks');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState(categories[0].id);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#0EA5E9');

  const currentDayTasks = tasks.filter(t => t.dayOfWeek === currentDay);
  const completedCount = currentDayTasks.filter(t => t.completed).length;
  const totalCount = currentDayTasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const weekStats = DAYS.map((_, idx) => {
    const dayTasks = tasks.filter(t => t.dayOfWeek === idx + 1);
    const dayCompleted = dayTasks.filter(t => t.completed).length;
    return { total: dayTasks.length, completed: dayCompleted };
  });

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      note: newTaskNote,
      completed: false,
      category: newTaskCategory,
      dayOfWeek: currentDay,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskNote('');
    setIsAddTaskOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: newCategoryColor,
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('#0EA5E9');
    setIsAddCategoryOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pb-20">
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-medium text-foreground mb-1">Задачи</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="px-6 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {DAYS.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDay(idx + 1)}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentDay === idx + 1
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                    : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'tasks' && (
          <div className="px-6 space-y-4 animate-fade-in">
            {currentDayTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="CheckCircle2" size={48} className="mx-auto mb-3 opacity-30" />
                <p>Нет задач на этот день</p>
              </div>
            ) : (
              currentDayTasks.map(task => {
                const category = getCategoryById(task.category);
                return (
                  <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h3>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Icon name="Trash2" size={16} />
                          </button>
                        </div>
                        {task.note && (
                          <p className="text-sm text-muted-foreground mb-2">{task.note}</p>
                        )}
                        {category && (
                          <Badge
                            style={{ backgroundColor: category.color + '20', color: category.color }}
                            className="text-xs font-normal"
                          >
                            {category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}

            <Button
              onClick={() => setIsAddTaskOpen(true)}
              className="w-full h-12 rounded-full shadow-lg"
              size="lg"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить задачу
            </Button>
          </div>
        )}

        {activeSection === 'calendar' && (
          <div className="px-6 space-y-4 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Обзор недели</h2>
              <div className="space-y-3">
                {DAYS.map((day, idx) => {
                  const stat = weekStats[idx];
                  const percent = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{day}</span>
                        <span className="text-muted-foreground">{stat.completed}/{stat.total}</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'stats' && (
          <div className="px-6 space-y-4 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Статистика</h2>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{progressPercent.toFixed(0)}%</div>
                  <p className="text-muted-foreground">Выполнено сегодня</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{completedCount}</div>
                    <p className="text-sm text-muted-foreground mt-1">Готово</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{totalCount - completedCount}</div>
                    <p className="text-sm text-muted-foreground mt-1">Осталось</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'categories' && (
          <div className="px-6 space-y-4 animate-fade-in">
            {categories.map(cat => (
              <Card key={cat.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Icon name="Trash2" size={18} />
                </button>
              </Card>
            ))}
            <Button
              onClick={() => setIsAddCategoryOpen(true)}
              className="w-full h-12 rounded-full"
              variant="outline"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить категорию
            </Button>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="px-6 space-y-4 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Настройки</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-foreground">Уведомления</span>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-foreground">Тема оформления</span>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-foreground">О приложении</span>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground">Версия</span>
                  <span className="text-muted-foreground">1.0.0</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <button
            onClick={() => setActiveSection('tasks')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'tasks' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="CheckSquare" size={24} />
            <span className="text-xs">Задачи</span>
          </button>
          <button
            onClick={() => setActiveSection('calendar')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'calendar' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Calendar" size={24} />
            <span className="text-xs">Календарь</span>
          </button>
          <button
            onClick={() => setActiveSection('stats')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'stats' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="BarChart3" size={24} />
            <span className="text-xs">Статистика</span>
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'categories' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Tag" size={24} />
            <span className="text-xs">Категории</span>
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'settings' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Settings" size={24} />
            <span className="text-xs">Настройки</span>
          </button>
        </div>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая задача</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Название задачи"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                placeholder="Заметка (необязательно)"
                value={newTaskNote}
                onChange={(e) => setNewTaskNote(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddTask}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая категория</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Название категории"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Цвет</label>
              <div className="flex gap-2 flex-wrap">
                {['#0EA5E9', '#8B5CF6', '#10B981', '#F97316', '#EF4444', '#EC4899'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-10 h-10 rounded-full transition-transform ${
                      newCategoryColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddCategory}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
